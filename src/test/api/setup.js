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

let resolveTransaction;
let rejectTransaction;

export let transaction = new Promise((resolve, reject) => {
	resolveTransaction = resolve;
	rejectTransaction = reject;
});

beforeEach(() => {

	request.jar();

	return transaction = neo4j().then((connection) => {
		return connection.begin();

	}).then((response) => {
		const transactionId = response[1].transactionId;
		resolveTransaction(transactionId);

	});

});

afterEach(() => {

	return neo4j().then((connection) => {
		return transaction.then((transactionId) => {
			return connection.rollback(transactionId);
		});
	});

});

after(() => {

	return serverStop();

});
