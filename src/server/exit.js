/* globals process, console */

import _ from 'underscore';
import vodoun from 'vodoun';

export default vodoun.register('exit', [
	'config'

], (service) => {

	const config = this.config;

	const listeners = [];
	let exitCode = 0;

	// Hook into all the process exit codes.
	const events = new Promise((resolve) => {

		let exiting = false;

		function exit(event) {
			if (!exiting) {
				exiting = true;
				resolve(event);
			}
		}

		process.on('SIGTERM', exit);
		process.on('SIGINT', exit);
		process.on('SIGQUIT', exit);
		process.on('uncaughtException', (error) => {
			exitCode = config.constant.EXIT_ERROR;
			console.error(error.stack);
			exit.apply(exit, arguments);
		});

	});

	// Resolve all the listeners as promises in one go.
	const closing = events.then(() => Promise.all(_.collect(listeners, (listener) => new Promise(listener))));

	let timer = null;

	// Make sure the exit doesn't take too long.
	const timeout = events.then(() => new Promise((resolve) => {
		return timer = setTimeout(() => resolve([
			config.constant.EXIT_TIMEOUT

		]), config.timeout.exit);
	}));

	// Whichever process finishes first.
	const first = new Promise((resolve) => {

		let triggered = false;

		const trigger = (data) => {
			if (!triggered) {
				triggered = true;
				resolve(data);
			}
		};

		closing.then(trigger);
		timeout.then(trigger);

	});

	// regardless which finishes first, clear the timeout.
	first.then(() => clearTimeout(timer));

	// exit the process with the provided code.
	first.then((list) => {
		const max = _.max(exitCode, _.max(list));
		process.exit(max);
	});

	service.register = (callback) => {
		listeners.push(callback);
	}

});
