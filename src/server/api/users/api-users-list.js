/* globals module, require */

import _ from 'underscore';
import httpConst from 'http-constants';

import resource from './api-users-resource.js';
import query from '../../neo4j.js';

import '../../prototypes.js'

const operation = resource.GET().as('json');

const cipher_list = '' +
	'MATCH (node:User),(user:User { email: {userEmail} })' +
	'  WHERE (' +
	'    (node) - [:Requires] -> (:Permission) <- [:Possesses] - (user) OR' +
	'    (node) - [:Requires] -> (:Permission) <- [:Implies] - (:Permission) <- [:Posesses] - (user)' +
	'  )' +
	'  XOR NOT (node) - [:Requires] -> (:Permission)' +
	'  RETURN id(node) as userId;';

export const name = 'list';

operation.permission = `/api/users[${name}]`;

operation.validator = (c) => {
	return {

		session: {
			principle: {
				email: c.required
			}
		}

	};
};

operation.handler = (request, response, params) => {

	const email = request.session.principle.email;

	return query(cipher_list, {
		userEmail: email

	}).getResults('userId').then(function(results) {

		response.status(httpConst.codes.OK).json(results);

		return Promise.resolve();

	});

};
