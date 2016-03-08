/* globals module, require */
'use strict';

import _ from 'underscore';

import { encrypt } from '../../prototypes.js';
import email from '../../email.js';
import resource from './api-auth-resource.js';

import query from '../../neo4j.js';

export const name = 'create';

const operation = resource.POST().as('json');

operation.validator = (c) => {
	return {

		body: {

			email: [
				c.email,
				c.required
			],

			callback: [
				c.url,
				c.required
			]

		}

	};
};

operation.handler = (request, response, params) => {

	const recovery = encrypt('md5', params.body.email, new Date().getMilliseconds());

	return query('' +
			'CREATE (node:User {\n' +
			'    email: {email},\n' +
			'    recovery: {recovery},\n' +
			'})\n' +
			'RETURN user.email as email;', {
		email: params.body.email,
		recovery: recovery

	}).getResult('email').then(function(email) {

		return email({
			to: email,
			subject: 'Animus: Email Verification',
			text: `Verify your account here: ${resource.path}`,
			html: `Verify your account here: <a>${resource.path}</a>`

		}).then((info) => {

			return response.status(200).links({
				login: `${resource.path}?email=${email}`

			}).json({});

		});

	});

};

