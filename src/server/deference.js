/* global */
'use strict';

export default class Deference extends Promise {

	constructor() {
		super((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}

	/**
	 * @template ResultType
	 * @param {ResultType} [result]
	 * @returns {Promise<ResultType>}
	 */
	resolve(result) {
		return this._resolve(result);
	}

	/**
	 * @param {*} [error]
	 * @returns {Promise<?>}
	 */
	reject(error) {
		return this._reject(error);
	}

}
