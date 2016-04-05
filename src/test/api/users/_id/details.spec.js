/* globals require, describe, it, beforeEach */

import chai from 'chai';

import * as setup from '../../setup.js';
import { request as login } from '../../auth/login.spec.js';
import neo4j from '../../../../server/neo4j.js';
import { encrypt } from '../../../../server/prototypes.js';

const expect = chai.expect;

export const request = (userId, changes) => {
	return setup.request({
		uri: `${setup.baseurl}/users/`,
		method: 'GET',
		body: changes
	});
};

describe("GET:/users/_id", () => {

	it('should be secured', () => {

		return request().then((response) => {
			expect(response).to.exist;
			expect(response.statusCode).to.equal(401);
		});

	});

	describe('When logged-in', () => {

		const cypher_createadmin = '' +
				'MATCH (p:Permission { name: "/users[create]" })\n' +
				'CREATE (user:User {\n' +
				'    email: {email},\n' +
				'    password: {password}\n' +
				'}) - [:Possesses] -> (p)\n' +
				'RETURN user;';

		const cypher_createUser = '' +
				'CREATE (user:User {\n' +
				'    email: {email},\n' +
				'    password: {password}\n' +
				'})' +
				'RETURN user;';

		beforeEach(() => {
			return promise = neo4j(cypher_createadmin, {
				email: 'admin@somewhere.com',
				password: encrypt('md5', 'password', 'admin@somewhere.com')

			}, setup.transactionId).getResult('user').then((user) => {
				return login(user['email'], user['password']);

			});
		});

		let promise;

	});

});
