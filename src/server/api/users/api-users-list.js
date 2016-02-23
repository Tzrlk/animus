/* globals module, require */

import _ from 'underscore';

import resource from './api-users-resource.js';
import query from '../../neo4j.js';

import '../../prototypes.js'

const operation = resource.GET().as('json');

const cipher_list = '' +
	'MATCH (node:User),(user:User { email: {userEmail} })' +
	'  WHERE (' +
	'    (node) - [:requires] -> (:Permission) <- [:possesses] <- (user) OR' +
	'    (node) - [:requires] -> (:Permission) <- [:implies] <- (:Permission) <- [:posesses] - (user)' +
	'  )' +
	'  XOR NOT (node) - [:Requires] -> (:Permission)' +
	'  RETURN id(node);';

export const name = 'list';

operation.permission = `/api/users[${name}]`;

operation.validator = (c) => {
	return {
	};
};

operation.handler = (request, response, params) => {

	const userId = params.session.principle.email;

	return query(cipher_list, {
		userEmail: email

	}).then(function(results) {

		console.info(JSON.stringify(results, null, '\t'));

		return Promise.resolve();

	});

};
