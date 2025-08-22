#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('ts-node/register');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Mocha = require('mocha');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { target } = require('./test-config.js');

const mocha = new Mocha();

mocha.addFile(target);

// Run the tests.
mocha.run(function (failures) {
	process.on('exit', function () {
		if (failures) {
			// exit with non-zero status if there were failures
			throw new Error(failures);
		}
	});
});
