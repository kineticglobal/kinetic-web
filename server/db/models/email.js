/*
* Schema for people who want to be added to the Kinetic Global newsletter listserv
*/

'use strict';

const mongoose = require('mongoose');
const apiKey = require('../../env/').SENDGRID.API_KEY;
const Sendgrid = require('sendgrid')(apiKey);


const EmailSchema = new mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String
	}
});


function addContact(newContact) {
	const request = Sendgrid.emptyRequest({
		method: 'POST',
		path: '/v3/contactdb/recipients',
		body: newContact
	});
	return Sendgrid.API(request);
}

EmailSchema.post('save', function (doc, next) {
	if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
		return next();
	}
	/*
	* sendgrid accepts an array for its info so when adding a new contact, we
	* create an array of length one initially with just the email. Then we add on
	* the users first and last name.
	*/
	const newContact = [
		{
			email: this.email,
		}
	];

	const firstName = this.name.split(' ')[0];
	if (firstName) {
		newContact[0].first_name = firstName;
	}

	const lastName = this.name.split(' ')[this.name.split(' ').length - 1]; //last elem in the array of names
	if (lastName && this.name.split(' ').length > 1) { //only if there's more than 1 elem in the array of names
	newContact[0].last_name = lastName;
}

addContact(newContact)
.then( () => {
	next();
})
.catch(next);
});


mongoose.model('EmailSignup', EmailSchema);
