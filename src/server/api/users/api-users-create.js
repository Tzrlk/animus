/* globals module, require */

import _ from 'underscore';

import { encrypt } from '../../prototypes.js';
import resource from './api-users-resource.js';

let cypher_createUser = '' +
	'CREATE (node:User {\n' +
	'    email: {email},\n' +
	'    password: {password},\n' +
	'    name: {name}\n' +
	'})\n' +
	'RETURN id(user) as userId;';

export const name = 'create';

const operation = resource.POST().as('json');

operation.validator = (c) => {
	return {

		session: {
			user: {
				email: [
					c.email,
					c.required
				]
			}
		},

		body: {

			email: [
				c.email,
				c.required
			],

			password: [
				c.string,
				c.required
			],

			name: [
				c.string
			]

		}

	};
};

operation.handler = function(request, response, params) {

	const hash = encrypt.pwdv1(params.body.email, params.body.password);

	return query(cypher_createUser, {
		email: params.body.email,
		name: params.body.name,
		password: hash

	}).getResult('userId').then(function(userId) {

		return response.status(200).links({
			result: `${resource.path}/${userId}`

		}).json({});

	});

};

