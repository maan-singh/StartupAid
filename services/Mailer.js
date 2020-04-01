const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super();

    // returns an object that we can use to communicate with the sendgrid api thats why we assign this popert to sgAPi
    // after getting this api object, put together a function that we will use to actually communicate the actual Mailer to sg api
    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email('monu-no-reply@startupaid.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  // create two helper variables and use them to do a little but of setup
  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  // process recipients and add to mailer
  addRecipients() {
    const personalize = new helper.Personalization();

    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  // take this Mailer and send it off to sendgrid, to actually be emailed out to all the people
  // this is an API request so ASYNCHRONOUS code
  // inside function, create sendgrid api request and then send it off to sendgrid
  // pass in some config options inside empty request object
  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    // after creating the request above, send off the request to sendgrid. We get a response back from sendgrid
    const response = this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
