define([

	'underscore',
	'angular',

	'angular-module'

], function(_, ng, _animus) {
	var COMPONENT_NAME = '$orchestrator';

	ng.module(_animus).provider(COMPONENT_NAME, [
		function() {
			var $provider = {};

			$provider.$get = [
				'$rootScope', '$util',
				function($root, $util) {
					var $service = {};

					function reference(type, identifier) {
						return 'session["' + type + ":" + identifier + '"]';
					}

					function accessor(type) {
						return function(id, item) {
							var ref = reference(type, id);

							if (item) {
								$util.$set($root, ref, item);
							}

							return $util.$get($root, ref);
						}
					}

					/**
					 *
					 * @param {String} name The name of the collection stored in the session.
					 * @param {Array} [collection] A collection to save to the session storage.
					 * @returns {Array} The collection saved in the session storage.
					 */
					$service.collection = accessor('collection');

					$service.$watchCollection = function(name, callback) {
						$root.$watchCollection(reference('collection', name), callback);
					};

					/**
					 *
					 * @param {String} id The id of the entity to store in the session.
					 * @param {Object} [entity] The entity to store in the session.
					 * @returns {Object} The entity stored in the session.
					 */
					$service.entity = accessor('entity');

					$service.$watchEntity = function(id, callback) {
						$root.$watch(reference('entity', id), callback, true);
					};

					/**
					 * Allows the storage and retrieval of form data. The format is that of a map, with the keys being
					 * the ids of each field in the form. If no data is provided, the function will do nothing but
					 * retrieve the form data
					 * @param {String} id The id of the form.
					 * @param {Object} [data] The data stored within the form.
					 * @returns {Object} The form data stored in the session.
					 */
					$service.form = accessor('form');

					$service.$watchForm = function(name, callback) {
						$root.$watch(reference('form', name), callback, true);
					};

					/**
					 * A convenience method for transferring forms from storage to the queue.
					 * @param id The id of the form to submit.
					 * @returns {Promise} The promise generated by queueing the form submission.
					 */
					$service.submit = function(id) {
						var form = $service.form(id);

						var operation = {
							id: id,
							type: 'submit',
							payload: form
						};

						return $service.queue(id, operation).then(function() {
							$service.form(id, {});
						});

					};

					/**
					 * Allows the storage and retrieval of form validation comments. The format is that of a map, with
					 * each of the keys matching data on the form, with validation messages as a list under them. If
					 * the key is an '_', then the validation applies to the whole form/sub-object. If no comments are
					 * provided, it will do nothing but retrieve the comments stored at that time.
					 * @param {String} id The id of the form to comment on.
					 * @param {Object} [comments] The comments on the form.
					 * @returns {Object} The comments on the form.
					 */
					$service.comments = accessor('comments');

					/**
					 * Provides the ability to add/retrieve a server-side operation request to/from the session queue.
					 * The queue is processed in no particular order, unless a dependency is explicitly defined in the
					 * operation itself. The format of an operation consists of a map with an id, a dependency list,
					 * a data payload
					 * @param {String} id The reference id of the operation to perform.
					 * @param {Object} operation An operation to be performed on the server.
					 * @returns {Promise} A promise for when the operation is fulfilled.
					 */
					$service.queue = accessor('queue');

					return $service;
				}
			];

			return $provider;
		}
	]);

	return COMPONENT_NAME;
});