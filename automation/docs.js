#!/usr/bin/env node

/**
 * This script assumes that:
 * - The "main" file declared in your package.json is annotated using JSDoc
 * - JSDoc annotations use the "@name" attribute
 * - Your mocha tests use the format "describe('my_function_name', () => { }"
 *   where "my_function_name" is the same as the functions "@name" attribute
 *
 * Ideally this should be moved to a seperate module.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const jsdoc2md = require('jsdoc-to-markdown');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const config = require('../package.json');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');

const baseDir = process.cwd();

const OUTFILE = path.join(baseDir, 'README.md');
const TEMPLATE_FILE = path.join(baseDir, 'doc/README.hbs');
const MAIN_FILE = path.join(baseDir, config.main);

const buildDocs = (report) => {
	// Prettify some parsed values
	const testReport = report
		.replace(/\(0, chai_1\.expect\)/g, 'chai.expect')
		.replace(/versions_1\.versions/g, 'versions');

	// Transform the report into an object keyed by the function name
	const describe = testReport.split(/##\s\W/).reduce((carry, item) => {
		const match = item.match(/^\w+\W+\n/);
		if (match) {
			carry[match[0].replace(/\W/g, '')] = item.replace(match[0], '');
		}
		return carry;
	}, {});

	const hbsTemplate = fs.readFileSync(TEMPLATE_FILE, 'utf8');

	return jsdoc2md
		.getTemplateData({
			files: [MAIN_FILE],
		})
		.then((data) => {
			data.forEach((d) => {
				const name = d.name;
				if (describe[name]) {
					d.examples = [describe[name]];
				}
			});
			return jsdoc2md.render({
				data,
				template: hbsTemplate,
			});
		})
		.then((result) => {
			fs.writeFileSync(OUTFILE, result);
		});
};

const capturedOutput = execSync('npx mocha --reporter markdown', {
	encoding: 'utf8',
});

buildDocs(capturedOutput);
