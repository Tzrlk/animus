/* globals require, describe, it, beforeEach */

import chai from 'chai';


import * as setup from '../setup.js';
import { request as login } from '../auth/login.spec.js';
import neo4j from '../../../server/neo4j.js';

const expect = chai.expect;

export const request = (userBody) => {
	return setup.request({
		uri: `${setup.baseurl}/users`,
		method: 'POST',
		body: userBody
	});
};

describe("POST:/users", () => {

	it('should be secured', () => {

		return request().then((response) => {
			expect(response).to.exist;
			expect(response.statusCode).to.equal(401);
		});

	});

	describe('When logged-in', () => {

		let promise;

		beforeEach(() => {
			return promise = neo4j(
					'MATCH (p:Permission { name: "/users[create]" }) ' +
					'CREATE (user:User { email: {email}, password: {password} }) - [:Possesses] -> (p)' +
					'RETURN user;',
					{
						email: 'admin@somewhere.com',
						password: 'password' // need to encrypt this.
					}

			).getResult('user').then((user) => {
				return login(user.email, user.password);

			});
		});

		it('should reject a missing email', () => {

			promise.then((response) => {
				expect(response.statusCode).to.equal(200);
				return request({
					password: 'irrelevant'
				});

			}).then((response) => {
				expect(response).to.exist;
				expect(response.statusCode).to.equal(400);

			});

		});

	});

});
