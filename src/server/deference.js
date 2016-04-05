/* global */
'use strict';

export class Deference {

	constructor() {
		this._promise = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}

	/**
	 * @returns {Promise.resolve}
	 */
	get resolve() {
		return this._resolve;
	}

	/**
	 * @returns {Promise.reject}
	 */
	get reject() {
		return this._reject;
	}

	/**
	 * @returns {Promise.then}
	 */
	get then() {
		return this._promise.then;
	}

	/**
	 * @returns {Promise.catch}
	 */
	get catch() {
		return this._promise.catch;
	}

}
