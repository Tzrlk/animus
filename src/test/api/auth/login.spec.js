/* global describe, it */
'use strict';

import chai from 'chai';
import req from 'request-promise';

const expect = chai.expect;

import * as setup from '../setup.js';

export const request = (email, password) => {

	const body = {};
	email && ( body.email = email );
	password && ( body.password = password );

	return req({
		resolveWithFullResponse: true,
		uri: `${setup.baseurl}/auth`,
		method: 'PUT',
		simple: false,
		json: true,
		body: body
	});

};

describe('POST:/auth', () => {

	it('should reject a missing email', () => {

		return request(undefined, 'irrelevantpassword').then((result) => {

			expect(result).to.exist;
			expect(result.statusCode).to.equal(400);

		});

	});

	it('should reject a missing password', () => {

		return request('irrelevantemail', undefined).then((result) => {

			expect(result).to.exist;
			expect(result.statusCode).to.equal(400);

		});

	});

	it('should reject a missing email and password', () => {

		return request(undefined, undefined).then((result) => {

			expect(result).to.exist;
			expect(result.statusCode).to.equal(400);

		});

	});

	it('should reject a bad email', () => {

		return request('notauser@dontexist.com', 'irrelevantpassword').then((result) => {

			expect(result).to.exist;
			expect(result.statusCode).to.equal(400);

		});

	});

	it('should reject a bad password', () => {

		return request('email@somewhere.com', 'wrongpassword').then((result) => {

			expect(result).to.exist;
			expect(result.statusCode).to.equal(400);

		});

	});

	it('should log-in a correct username + password', () => {

		return request('email@somewhere.com', 'password').then((result) => {

			expect(result).to.exist;
			console.info(JSON.stringify(result.body));
			expect(result.statusCode).to.equal(204);

		});

	});

});
