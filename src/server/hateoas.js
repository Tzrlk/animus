/* global */
'use strict';

import Hateoas from 'express-hateoas/src/main/hateoas';
import vodoun from 'vodoun';

export default vodoun.register('hateoas', [
	'express'

], (service) => {

	const express = this.express;

	service.hateoas = new Hateoas(express);

});
