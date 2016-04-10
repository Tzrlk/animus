/* globals require, process, JSON, console, __dirname */

var paths = require('path');
var traceur = require('traceur');
var vodoun = require('vodoun');

require('traceur-source-maps').install(traceur);
traceur.require.makeDefault(function (filePath) {
	return !~filePath.indexOf('node_modules');
});

var config = require('./src/server/config');

console.log('process.env: ' + JSON.stringify(process.env, null));
console.log('config: ' + JSON.stringify(config, null));

console.log('Beginning vodoun scan.');
vodoun.scan(paths.resolve(__dirname, "src/server"), "**/*.js").then(function (files) {
	console.log('vodoun scan complete. ' + files.length + " files successfully processed.");

	console.log('starting server.');
	return vodoun.resolve('server').then(function (server) {
		return server.start();
	});

}).catch(function(error) {
	console.error(error.stack);

});
