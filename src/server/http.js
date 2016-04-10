/* globals console */

import http from 'http';
import Denodeify from 'es6-denodeify';
import vodoun from 'vodoun';

const denodeify = new Denodeify(Promise);

/** @type http.Server */
const Server = http.Server;

export default vodoun.register('http', [
	'express',
	'config',
	'exit'

], (service) => {

	const express = this.express;
	const config = this.config;
	const exit = this.exit;

	// create and start the HTTP server with static file serving.
	const server = new Server(express.app);

	/**
	 * @typedef Event ListeningEvent
	 * @property {String} code
	 */
	/**
	 * @param {Number} port
	 * @param {String} [hostname]
	 * @returns {Promise<ListeningEvent>}
	 */
	service.listen = (port, hostname) => {
		return new Promise((resolve, reject) => {

			const running = http.listen(port, hostname, (error, result) => {

				if (error) {
					return reject(error);
				}

				return resolve(result);

			});

			running.on('error', (error) => {
				return reject(error);
			});

		});
	};

	/**
	 * @return {Promise}
	 */
	service.close = denodeify(http.close);

	exit.register(function(resolve) {

		if (!server) {
			console.log('Http server has not been created.');
			return resolve(config.constant.EXIT_OK);
		}

		try {
			server.close();
			return resolve(config.constant.EXIT_OK);

		} catch (error) {
			console.error(error);
			resolve(config.constant.EXIT_HTTP);
		}

	});

});
