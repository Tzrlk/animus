/* globals __dirname, process */

import vodoun from 'vodoun';

export default vodoun.register('config', [], (service) => {

	service.path = {
		base: __dirname
	};

	service.debug = process.env['production']
			? process.env['production'] !== 'true'
			: true;

	service.hostname = process.env['HOST']
		|| 'localhost';

	service.port = process.env['PORT']
		|| 8000;

	service.database = {
		url: process.env['GRAPHENEDB_URL']
			|| 'http://neo4j:password@localhost:7474'
	};

	service.session = {
		secret: process.env['SECRET']
			|| 'secret'
	};

	service.timeout = {
		exit: 5000
	};

	service.constant = {

		EXIT_OK: 0,
		EXIT_DB: 1,
		EXIT_HTTP: 2,
		EXIT_SOCKET: 3,
		EXIT_SWARM: 4,
		EXIT_TIMEOUT: 5,
		EXIT_ERROR: 6,
		EXIT_NEO4J: 7

	};

	service.smtp = {
		service: 'gmail',
		pool: true,
		auth: {
			user: 'animus@cruciblelarp.com',
			pass: 'password'

		}
	};

});
