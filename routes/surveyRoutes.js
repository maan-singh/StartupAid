const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailtemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = (app) => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false,
    });

    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    const events = _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false },
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date(),
          }
        ).exec();
      })
      .value();

    console.log(events);

    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients
        .split(',')
        .map((email) => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // Great place to send an email!
    const mailer = new Mailer(survey, surveyTemplate(survey));
    // ASYNC FUNCTION SEND!! - we have to wait for the API request inside of it to conclude or for that mailer to be sent off to sendgrid
    // before we go ahead and save the survey.
    // we want to make sure that we say pause and wait for this thing to finish what it's doing before going on to the next line of code.
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      // We send back the updated user model to specifically indicate the new value of credits, same way we did credit addition in billingRoutes.
      // Whenever the user pays us some money, we send back the user model with the updated number of credits, so that the Header inside our app will automatically update.
      // So, by sending back the user here as well, we can make sure that we catch this updated user model inside of our auth reducer and get the Header number of credits to update as well.
      res.send(user);
    } catch (err) {
      res.status(422).send(err); // 422 unprocessable entity - the data that got sent is wrong!
    }
  });
};

// for webhooks route.
// if array has only 1 object which I noticed in the webhook.
// const event = req.body[0];
// const pathname = new URL(event.url).pathname;
// const p = new Path('/api/surveys/:surveyId/:choice');
// console.log(p.test(pathname));
