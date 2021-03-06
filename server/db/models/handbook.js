/*
* Schema used for people who want to get a copy of the Kinetic Handbook.
* Info comes from the form on the launch state: www.kineticglobal.org/get-the-handbook
*/

'use strict';

const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const sendEmail = require('../../modules/sendAnEmail.js').formatAndSendEmail;

const HandbookSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	profession: {
		type: String
	},
	member: {
		type: Boolean
	},
	interested: {
		type: Boolean
	},
	curious: {
		type: Boolean
	},
	workAtUniversity: {
		type: Boolean
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
		subject: 'Your copy of the Kinetic Handbook!',
		content: `<p>Hi ${name},</p>

		<p>Thank you for expressing interest in obtaining a copy of the Kinetic Handbook. Please click the link below to download your copy.</p>

		<p>https://drive.google.com/file/d/0B4NnXbzOu-EuSDZoSkJScld6SHc/view</p>

		<p>Best,</p>
		<p>The team at Kinetic Global</p>`
	};

	return sendEmail(emailInfo);
}

function sendAdminEmail(doc) {

	const clientName = doc.name;
	const clientEmail = doc.email;

	const emailInfo = {
		from: 'noreply@kineticglobal.org',
		to: 'general@kineticglobal.org',
		subject: 'New request for the Kinetic Handbook',
		content: `<p> Hi, </p>
		<p>${clientName} has just requested a copy of the Kinetic Handbook.</p>

		<p>You can reach out to them at ${clientEmail}</p>

		<p>Best, </p>
		</p>The team at Kinetic Global</p>`

	};

	return sendEmail(emailInfo);
}

HandbookSchema.post('save', function (doc, next) {

	Bluebird.all([sendClientEmail(this), sendAdminEmail(this)])
	.then(() => {
		next();
	})
	.catch(next);
});

mongoose.model('GetTheHandbook', HandbookSchema);
