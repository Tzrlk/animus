/* globals process, __dirname, console */

import vodoun from 'vodoun';

import Deference from './deference';

export default vodoun.register('server', [
	'config',
	'express',
	'http'

], (service) => {

	const config = this.config;
	const express = this.express;
	const http = this.http;

	let running = false;

	/**
	 * @returns {Promise}
	 */
	service.start = () => {

		if (running) {
			return Promise.reject(new Error('Server already running.'));
		}

		running = true;
		return http.listen(config.port, config.hostname).then((result) => {
			console.log(`Started application on http://${config.hostname}:${config.port}/`);
			return result;

		}, (error) => {
			running = false;
			throw error;

		});

	};

	/**
	 * @returns {Promise}
	 */
	service.stop = () => {

		if (!running) {
			return Promise.reject(new Error('Server isn\'t running.'));
		}

		return http.close().then(() => {
			running = false;

		});

	};

	express.app.use((error, request, response, next) => {

		if (response.headersSent) {
			return next(error);
		}

		console.error(error.stack);
		response
				.status(500)
				.send('Something broke!');

	});

});
