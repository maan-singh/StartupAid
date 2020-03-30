const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

// will send a response back to our api from stripe saying charge successfully created
module.exports = app => {
  app.post('/api/stripe', async (req, res) => {
    //forbidden - you have to be logged in to make a request to this endpoint.
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    });

    req.user.credits += 5;
    const user = await req.user.save();
    res.send(user);
  });
};
