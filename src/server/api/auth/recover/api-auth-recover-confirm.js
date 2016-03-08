/* globals */
'use strict';

import httpConst from 'http-constants';

import { encrypt } from '../../../prototypes.js';
import resource from './api-auth-recover-resource.js';

import authResource from '../api-auth-resource.js';
import { name as _login } from '../api-auth-login.js';

import query from '../../../neo4j.js';

export const name = 'recover';

const operation = resource.PUT().as('json');

operation.validator = (c) => {
	return {

		body: {

			email: [
				c.required,
				c.email
			],

			recovery: [
				c.required,
				c.string
			],

			password: [
				c.required,
				c.string
			]

		}

	}
};

const cypher_findUser = '' +
		'MATCH (user:User {\n' +
		'    email: {email}\n' +
		'}\n' +
		'RETURN user;';

const cypher_changePassword = '' +
		'MATCH (user:User {\n' +
		'    _id: {userId}\n' +
		'}\n' +
		'SET user.password = {password}\n' +
		'REMOVE user.recovery\n' +
		'RETURN user;';

operation.handler = (request, response, params) => {

	return query(cypher_findUser, {
		email: params.body.email

	}).getResult('user').then((user) => {

		if (!user['recovery'] || ['user.recovery'] !== params.body.recovery) {
			return response.status(httpConst.codes.NOT_FOUND).json({});
		}

		const hash = encrypt.pwdv1(user['email'], params.body.password);

		return query(cypher_changePassword, {
			userId: user['_id'],
			password: hash
		});

	}).getResult('user').then((user) => {

		return response.status(httpConst.codes.OK).links({
			[_login]: `${authResource.path}?email=${user['email']}`

		}).json({});

	});

};
