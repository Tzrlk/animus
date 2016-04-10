/* global */
'use strict';

import _ from 'underscore';
import NodeMailer from 'nodemailer';
import Denodeify from 'es6-denodeify';
import vodoun from 'vodoun';

const denodeify = new Denodeify(Promise);

const bounce = (error) => {

	if (error) {
		throw error;
	}

};

export default vodoun.register('email', [
	'config',
	'queues',
	'exit'

], (service) => {

	const config = this.config;
	const queues = this.queues;
	const exit = this.exit;

	const transport = NodeMailer.createTransport(config.smtp);
	const sendMail = denodeify(transport.sendMail);

	//TODO: add in template management.

	/**
	 * @param {Object<String, ?>} options
	 * @returns {Promise}
	 */
	service.send = (options) => {
		return queues.push('mail', options);
	};

	queues.processor('mail', (message) => sendMail(_.defaults(message, {
		sender: '"Animus" <animus@cruciblelarp.com>'

	})));

	exit.register(() => {
		return queues.close('mail');

	});

});

