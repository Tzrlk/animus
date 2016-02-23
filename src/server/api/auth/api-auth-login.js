/* globals console, JSON */
'use strict';

import _ from 'underscore';
import crypto from 'crypto';
import httpConst from 'http-constants';

import resource from './api-auth-resource.js';
import query from '../../neo4j.js'

import '../../prototypes.js'

const operation = resource.PUT().as('json');

const cipher_login = '' +
	'MATCH (user:User { email: {email} })' +
	'  RETURN user;';

const cipher_permissions = '' +
	'MATCH (user:User{ email: {email} }) - [*] -> (permission:Permission)' +
	'   RETURN permission;';

operation.validator = (c) => {
	return {

		body: {

			email: [
				c.email,
				c.required
			],

			password: [
				c.string,
				c.required
			]

		}

	};
};

operation.handler = (request, response, params) => {

	const email = params.body.email;
	const password = params.body.password;
	console.info(`Starting login for ${email}...`);

	return query(cipher_login, {
		email: email

	}).getResult('user').then(function(result) {

		const principle = {
			name: result['name'],
			email: result['email']
		};

		// run crypto hash on supplied password.
		const hash = crypto.createHash('md5')
				.update(password)
				.digest('hex');

		if (hash !== result['password']) {
			console.info(`Couldn't validate user's password`);
			return response.status(httpConst.codes.UNAUTHORIZED).json({});
		}

		return query(cipher_permissions, {
			email: principle.email

		}).getResults('permission').then((results) => {

			console.info(`Permissions extracted from database: ${JSON.stringify(results)}`);

			principle.permissions = results.map((result) => result.name);

			principle.token = crypto.createHash('md5')
					.update(principle.email + hash)
					.digest('hex');

			// This is where the user is loaded into the session.
			request.session.user = principle;
			console.info(`User principle added to session: ${JSON.stringify(principle)}`);

			return response.status(httpConst.codes.OK).json(principle);

		}, (error) => {
			console.info(JSON.stringify(error, null, '\t'));
		});

	}, (error) => {

		if (error && error.name && error.name === 'NotFoundError') {
			console.info(`Couldn't find user for email ${email}`);
			return response.status(httpConst.codes.NOT_FOUND).json({});
		}

	});

};
