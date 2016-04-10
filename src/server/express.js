/* globals __dirname */

import Express from 'express';
import FileStore from 'session-file-store';
import ErrorHandler from 'errorhandler';
import Session from 'express-session';
import Helmet from 'helmet';
import BodyParser from 'body-parser';
import vodoun from 'vodoun';

const SessionFileStore = new FileStore(Session);

export default vodoun.register('express', [
	'config'

], (service) => {

	const config = this.config;

	const app = service.app = new Express();

	app.use(new ErrorHandler());
	app.use(BodyParser.json());
	app.use(new Helmet());

	app.use(Session({
		secret: config.session.secret,
		saveUninitialized: true,
		resave: false,
		cookie: {
			path: '/',
			httpOnly: false,
			secure: false,
			maxAge: 3600000
		},
		store: new SessionFileStore({
			reapAsync: false
		})
	}));

	app.use(Express.static('src/server/static'));

});
