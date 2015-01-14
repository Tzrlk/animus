var ng = require('angular');
var template = require('./login-template.html');

require('../angular-module.js');
require('./login-controller.js');

ng.module('animus').directive('loginPanel', function() {

	return {
		restrict: 'A',
		template: template,
		controller: 'loginController'
	};

});

