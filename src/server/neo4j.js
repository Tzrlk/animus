/* globals require, module */

import Neo4j from 'neo4j-simple';
import vodoun from 'vodoun';

export default vodoun.register('neo4j', [
	'config'

], (service) => {

	const config = this.config;

	/** @type {Neo4j} */
	let connection = null;

	/**
	 * @returns {Promise<Neo4j>} A neo4j database connection.
	 */
	service.connect = () => {
		return new Promise((resolve, reject) => {
			try {

				if (!connection) {
					connection = new Neo4j(config.database.url, {
						idName: 'id'
					});
				}

				return resolve(connection);

			} catch (error) {
				return reject(error);
			}
		});
	};

	/**
	 * @param {String} query
	 * @param {Object<String, ?>} params
	 * @param {String} [transactionId]
	 * @returns {Promise<>}
	 */
	service.query = (query, params, transactionId) => {
		return connect().then((db) => {
			return transactionId
					? db.query(transactionId, query, params)
					: db.query(query, params);
		});
	}

});
