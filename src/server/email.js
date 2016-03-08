/* global */
'use strict';

import _ from 'underscore';
import nodemailer from 'nodemailer';

const smtpConfig = {
	service: 'gmail',
	pool: true,
	auth: {
		user: 'animus@cruciblelarp.com',
		pass: 'password'

	}
};

export const transport = nodemailer.createTransport(smtpConfig);

//TODO: add in template management.
//TODO: add in message queue usage.

export default (options) => {
	return new Promise((resolve, reject) => {

		transport.sendMail(_.defaults(options, {
			sender: '"Animus" <animus@cruciblelarp.com>'

		}), (error, info) => {

			if (error) {
				reject(error);
				return;
			}

			resolve(info);

		});

	});
};
