/**
 * This script assumes that:
 * - The "main" file declared in your package.json is annotated using JSDoc
 * - JSDoc annotations use the "@name" attribute
 * - There is a test script in package.json that uses mocha
 * - Your mocha tests use the format "describe('my_function_name', () => { }"
 * where "my_function_name" is the same as the functions "@name" attribute
 *
 * Ideally this should be moved to a seperate module.
 */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
const { exec } = require('child_process');
const config = require('./package.json');

const OUTFILE = './README.md';
const TEMPLATE_FILE = './doc/README.hbs';

let testCMD = config.scripts.test

if (!testCMD.includes('mocha')) {
	throw new Error('package.json "test" script does not use mocha!');
}

// Strip out any existing reporter option from the command, then add the markdown reporter
testCMD = testCMD.replace(/--reporter\s+\w+/, '')
	.replace('mocha', 'mocha --reporter markdown');

// Inherit and prefix PATH variable so the command behaves in an expected way
const pathPrefix = `PATH=${process.cwd()}/node_modules/.bin:${process.env.PATH}:$PATH`;
const fullCMD = testCMD.split('&&').map((t) => `${pathPrefix} ${t}`).join('&&');

exec(fullCMD, (error, stdout, stderr) => {
	if (error) {
		throw new Error(`exec error: ${error}`);
	}
	if (stderr) {
		throw new Error(`stderr: ${stderr}`);
	}

	// Prettify some parsed values
	const testReport = stdout.replace(/chai_1/g, 'chai');

	// Transform the report into an object keyed by the function name
	const describe = testReport.split(/##\s\W/).reduce((carry, item) => {
		const match = item.match(/^\w+\W+\n/);
		if (match) {
			carry[match[0].replace(/\W/g, '')] = item.replace(match[0], '');
		}
		return carry;
	}, {});

	const hbsTemplate = fs.readFileSync(TEMPLATE_FILE, 'utf8');

	jsdoc2md.getTemplateData({
		files: [config.main]
	})
	.then((data) => {
		data.forEach((d) => {
			let name = d.name;
			if (describe[name]) {
				d.examples = [describe[name]];
			}
		});
		return jsdoc2md.render({
			data,
			template: hbsTemplate
		});
	})
	.then((result) => {
		fs.writeFile(OUTFILE, result);
	});
});
