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

require('ts-node/register');
const Mocha = require('mocha');
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
const config = require('../package.json');
const { target } = require('./test-config.js');
const path = require('path');

const baseDir = process.cwd();

const OUTFILE = path.join(baseDir, 'README.md');
const TEMPLATE_FILE = path.join(baseDir, 'doc/README.hbs');
const MAIN_FILE = path.join(baseDir, config.main);

const buildDocs = report => {
  // Prettify some parsed values
  const testReport = report.replace(/chai_1/g, 'chai');

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
    .then(data => {
      data.forEach(d => {
        let name = d.name;
        if (describe[name]) {
          d.examples = [describe[name]];
        }
      });
      return jsdoc2md.render({
        data,
        template: hbsTemplate,
      });
    })
    .then(result => {
      fs.writeFile(OUTFILE, result);
    });
};

let capturedOutput = [];

const mocha = new Mocha({
  reporter: 'markdown',
});

mocha.addFile(target);

const originalWrite = process.stdout.write;

// Capture stdout into a file so we can generate a markdown report
process.stdout.write = function(str) {
  capturedOutput += str;
};

// Run the tests.
mocha.run(function(failures) {
  // Restore stdout
  process.stdout.write = originalWrite;

  if (failures) {
    // exit with non-zero status if there were failures
    throw new Error(failures);
  }

  buildDocs(capturedOutput);
});
