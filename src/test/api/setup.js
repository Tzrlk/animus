/* globals before, after, beforeEach, afterEach, describe, it, console */

import req from 'request-promise';

import { connect as neo4j } from '../../server/neo4j.js';
import { start as serverStart, stop as serverStop } from '../../server/server.js';

export const baseurl = 'http://localhost:8000/api';

export const request = req.defaults({
	resolveWithFullResponse: true,
	simple: false,
	json: true,
	jar: true
});

let server;

before(() => {

	req.debug = true;

	return neo4j().then(() => {
		return server = serverStart();
	});

});

let transactionId;

beforeEach(() => {

	request.jar();

	return neo4j().then((connection) => {
		return connection.begin();

	}).then((response) => {
		transactionId = response[1]['transactionId'];

	});

});

afterEach(() => {

	return neo4j().then((connection) => {
		connection.rollback(transactionId);
		return Promise.resolve();
	});

});

after(() => {

	return serverStop();

});
