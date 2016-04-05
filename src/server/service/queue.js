/* globals */

import vodoun from 'vodoun';
import fileQueue from 'file-queue';

/**
 * @typedef * ItemType
 */

/**
 * @type {Queue<ItemType>}
 */
const Queue = fileQueue.Queue;

/**
 * @param {Object<String, Queue<ItemType>>} cache
 * @param {String} queueName
 * @param {Function} [callback]
 * @returns {Queue<ItemType>}
 */
function getQueue(cache, queueName, callback) {

	const cached = cache[queueName];
	if (cached) {
		return cached;
	}

	const created = new Queue(`./queues/${queueName}`, callback);

	cache[queueName] = created;
	return created;

}

export default vodoun.register('queues', [], (service) => {

	/**
	 * @type {Object<String, Queue<ItemType>>}
	 */
	const queues = {};

	/**
	 * @param {String} queueName
	 * @param {ItemType} item The item to add to the queue.
	 * @return {Promise<ItemType>} The item inserted.
	 */
	service.push = (queueName, item) => new Promise((resolve, reject) => {
		getQueue(queues, queueName).push(item, (error) => {

			if (error) {
				return reject(error);
			}

			resolve(item);

		});
	});

	/**
	 * @callback pop~callback
	 * @param {ItemType} message
	 * @returns {Promise<ItemType>}
	 */
	/**
	 * @param {String} queueName
	 * @param {pop~callback} [callback]
	 * @returns {Promise<ItemType>}
	 */
	service.pop = (queueName, callback) => new Promise((resolve, reject) => {

		const queue = getQueue(queues, queueName);

		if (!callback) {

			queue.pop((error, message) => {

				if (error) {
					return reject(error);
				}

				resolve(message);

			});

			return;

		}

		queue.tpop((error, message, commit, rollback) => {

			if (error) {
				return rollback((failure) => {
					return reject(failure || error);
				});
			}

			try {

				callback(message).then(() => {
					return commit((failure) => {
						return reject(failure);
					});

				}, (error) => {
					return rollback((failure) => {
						return reject(failure || error);
					});

				});

			} catch (error) {
				return rollback((failure) => {
					return reject(failure || error);
				});
			}

		});

	});

});
