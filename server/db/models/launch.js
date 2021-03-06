/*
* Schema used for people who want to launch a chapter of Kinetic on their campus.
* Info comes from the form on the launch state: www.kineticglobal.org/launch-a-chapeter
* An email is sent out to both the user saying thank you and to the admin email
* with the info of who wanted to join.
*/

'use strict';

const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const sendEmail = require('../../modules/sendAnEmail.js').formatAndSendEmail;

const LaunchSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	school: {
		type: String
	},
	year: {
		type: String
	},
	questions: {
		type: String
	},
	newsletter: {
		type: Boolean
	}
});

function sendClientEmail(doc) {
	const name = doc.name.split(' ')[0];

	const emailInfo = {
		from: 'thanks@kineticglobal.org',
		to: doc.email.toLowerCase(),
		subject: 'Thanks for your interest!',
		content: `<p>Hi ${name},</p>

		<p>Thanks for expressing your interest in launching a chapter of Kinetic Global at ${doc.school}! We'll be reaching out to you shortly to follow up. In the meantime, if you have any questions, email us at admin@kineticglobal.org.</p>

		<p>Best,</p>
		<p>The team at Kinetic Global</p>`
	};

	return sendEmail(emailInfo);
}

function sendAdminEmail(doc) {
	const clientName = doc.name;
	const clientEmail = doc.email;
	const emailInfo = {
		from: 'noreply-launch-interest@kineticglobal.org',
		to: ['general@kineticglobal.org', 'bryan.jones@kineticglobal.org', 'jessica.bernheim@kineticglobal.org', 'katie.swoap@kineticglobal.org'],
		subject: 'New interest in launching a Kinetic Global chapter!',
		content: `<p>Hi,</p>

		<p>${clientName} has just expressed interest in launching a chapter of Kinetic Global at ${doc.school}.</p>

		<p>You can reach out to them at ${clientEmail}.</p>

		<p>Best,</p>
		<p>The team at Kinetic Global</p>`

	};

	return sendEmail(emailInfo);
}

LaunchSchema.post('save', function (doc, next) {

	Bluebird.all([sendClientEmail(this), sendAdminEmail(this)])
	.then(() => {
		next();
	})
	.catch(next);
});


mongoose.model('LaunchAChapter', LaunchSchema);
