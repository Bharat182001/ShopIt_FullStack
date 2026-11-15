const express = require("express");
const router = express.Router();
const { processPayment, sendStripeApiKey } = require("../controllers/paymentController");

const {isAuthenticatedUser} = require("../middleware/auth");

router.route('/payment/process').post(isAuthenticatedUser, processPayment);

// A Stripe publishable key is designed to be exposed to the browser.
router.route('/stripeapikey').get(sendStripeApiKey);

module.exports = router;
