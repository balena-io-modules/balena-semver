#!/usr/bin/env node

require('ts-node/register');
const Mocha = require('mocha');
const { target } = require('./test-config.js');

const mocha = new Mocha();

mocha.addFile(target);

// Run the tests.
mocha.run(function(failures) {
	process.on('exit', function () {
		if (failures) {
			// exit with non-zero status if there were failures
			throw new Error(failures);
		}
	});
});
