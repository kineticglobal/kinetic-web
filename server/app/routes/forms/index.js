'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const EmailSignup = mongoose.model('EmailSignup');
const LaunchAChapter = mongoose.model('LaunchAChapter');
const Questions = mongoose.model('Questions');
const GetTheHandbook = mongoose.model('GetTheHandbook');
const ContactRequest = mongoose.model('ContactRequest');
const Nominate = mongoose.model('Nominate');
const BecomeAMentor = mongoose.model('BecomeAMentor');
const Bluebird = require('bluebird');
//TODO: Figure out proper way to reference API Key
const stripe = require('stripe')(STRIPE_API_KEY);

module.exports = router;

router.post('/launch-a-chapter', (req, res, next) => {
	//adds form data to dbs, emails the client and admins, and send back a 200 if successful
	//throws a 500 and sends back the error if unsuccessful
	Bluebird.resolve()
		.then(() => {
			if (req.body.email && req.body.newsletter) {
				return EmailSignup.create(req.body);
			}
			return;
		})
		.then((e) => {
			return LaunchAChapter.create(req.body);
		})
		.then(() => {
			if (req.body.questions) {
				return Questions.create(req.body);
			}
			return;
		})
	// When everything has completed we should redirect them to a page saying so
	// or add a confirmation popup or something dynamic like this
		.then(() => res.send())
		.catch(err => {
			console.error(err);
			res.status(500).send(err);
		});
});

// post request for get-the-handbook form
router.post('/get-the-handbook', (req, res, next) => {
	Bluebird.resolve()
		.then(() => {
			if (req.body.email && req.body.newsletter) {
				return EmailSignup.create(req.body);
			}
			return;
		})
		.then(() => {
			return GetTheHandbook.create(req.body);
		})
		.then(() => res.send())
		.catch(err => {
			console.error(err);
			res.status(500).send(err);
		});
});

router.post('/nominate-expert', (req, res, next) => {
	//adds form data to dbs, emails the client and admins, and send back a 200 if successful
	//throws a 500 and sends back the error if unsuccessful
	Bluebird.resolve()
		.then(() => {
			if (req.body.email && req.body.newsletter) {
				return EmailSignup.create(req.body);
			}
			return;
		})
		.then(() => {
			const nominationData = {
				nomineeName: req.body.nomineeName,
				nominatorName: req.body.name,
				nominatorEmail: req.body.email,
				nomineeExpertise: req.body.nomineeExpertise,
				relationship: req.body.relationship
			};

			return Nominate.create(nominationData);
		})
		.then(() => {
			res.send();
		})
		.catch(err => {
			console.error(err);
			res.status(500).send(err);
		});
});


router.post('/contact-us', (req, res, next) => {
	//adds form data to dbs, emails the client and admins, and send back a 200 if successful
	//throws a 500 and sends back the error if unsuccessful
	Bluebird.resolve()
		.then(() => {
			if (req.body.email && req.body.newsletter) {
				return EmailSignup.create(req.body);
			}
			return;
		})
		.then((e) => {
			return ContactRequest.create(req.body);
		})
	// When everything has completed we should redirect them to a page saying so
	// or add a confirmation popup or something dynamic like this
		.then(() => res.send())
		.catch(err => res.status(500).send(err));
});


router.post('/become-a-mentor', (req, res, next) => {
	Bluebird.resolve()
		.then (() => {
		})
		.then(() => {
			if (req.body.email && req.body.newsletter) {
				return EmailSignup.create(req.body);
			}
			return;
		})
		.then (() => {
			if (req.body.email) {
				return BecomeAMentor.create(req.body);
			}
			return;
		})
		.then(() => res.send())
		.catch(err => res.status(500).send(err));
});

router.post('/make-a-donation', (req, res, next) => {
	Bluebird.resolve()
	.then (() => {
	})
	.then(() => {
		const centValue = req.body.amount * 100;
		const donnerName = req.body.name;

		//TODO: make sure stripeToken is getting passed to the server
		const token = req.body.stripeToken;

		var charge = stripe.charges.create({
			amount: centValue, // amount in cents
			currency: "usd",
			source: token,
			description: "Donation from " + donnerName;
		}, function (err, charge) {
			if (err && err.type === 'StripeCardError') {
				// Card has been declined
				console.log("CARD HAS BEEN DECLINED");
			}
		});
	})
	.then(() => res.send())
	.catch(err => res.status(500).send(err));
});


