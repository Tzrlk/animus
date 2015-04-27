(function(){
	'use strict';

	var config = {

		'baseUrl': 'src/server/static',

		'paths': {
			'require': 'lib/require',
			'text': 'lib/text',
			'angular': 'lib/angular',
			'underscore': 'lib/underscore',
			'swarm-client': 'lib/swarm-client',
			'ui-router': 'lib/angular-ui-router',
			'ui-bootstrap': 'lib/ui-bootstrap',
			'ui-bootstrap-tpls': 'lib/ui-bootstrap-tpls',
			'angulartics': 'lib/angulartics',
			'angulartics-google': 'lib/angulartics-ga',
			'uri': 'lib/URI'
		},

		'shim': {

			'angular': {
				'exports': 'angular',
				'deps': [
					'require'
				]
			},

			'text': {
				'deps': [
					'require'
				]
			},

			'swarm-client': {
				'exports': 'Swarm',
				'deps': [
					'require'
				]
			},

			'ui-router': {
				'deps': [
					'angular'
				]
			},

			'ui-bootstrap': {
				'deps': [
					'angular',
					'ui-bootstrap-tpls'
				]
			},

			'angulartics': {
				'exports': 'angulartics',
				'deps': [
					'angular'
				]
			},

			'angulartics-google': {
				'deps': [
					'angular',
					'angulartics'
				]
			}

		}

	};

	if (module) {
		module.exports = config;
	} else {
		require.config(config);
	}

})();
