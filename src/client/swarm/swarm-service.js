var app = require('angular-module');
var swarm = require('swarm');

module.exports = app.service('$swarm', [
	'$rootScope'
], function($root) {

	var host = new swarm.Host('cruciblemanager');

	$root.$watch('storage.config.swarmhost', function(newval, oldval) {

		if (!newval || newval != oldval) {
			host.disconnect();
		}

		if (newval) {
			host.connect(newval);
		}

	});

	return {

		watch: function(identifier) {
			return host.get(identifier);
		}

	}

});
