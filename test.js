const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
const ts = require('typescript');
const acorn = require('acorn');
const dedent = require('dedent-js');

let testFileSrc = fs.readFileSync('./test/index.spec.ts', 'utf8');
let testFile = ts.transpileModule(testFileSrc, {}).outputText;
// Prettify some parsed values
testFile = testFile.replace('chai_1', 'chai').replace('versions_1', 'V');

console.log(testFile);

console.log(acorn.parse(testFile));
const syntaxTree = acorn.parse(testFile);

const formatFnBody = (body) => {
	// Strip first and last line
	let formattedValue = body.replace(/([\r\n].*$|^.*[\r\n])/g, '');

	// Dedent code
	formattedValue = dedent(formattedValue).replace(/^\s+/, '');

	return formattedValue;
};

const describe = syntaxTree.body.reduce((carry, item) => {
	if (item.expression && item.expression.callee && item.expression.callee.name === 'describe') {
		item.expression.arguments[1].body.body.forEach((innerItem) => {
			if (item.expression && item.expression.callee && item.expression.callee.name === 'describe') {
				console.log(innerItem);
				const { value } = innerItem.expression.arguments[0];
				const { start, end } = innerItem.expression.arguments[1];
				const fnBody = testFile.slice(start, end);
				console.log(formatFnBody(fnBody));
				carry[value.replace(/\W/g, '')] = formatFnBody(fnBody);
			}
		});
	}
	return carry;
}, {});

console.log(describe);

jsdoc2md.getTemplateData({
	files: ['./src/index.js']
})
.then((data) => {
	console.log(data);
	data.forEach((d) => {
		let name = d.name;
		if (describe[name]) {
			d.examples = [describe[name]];
		}
	});
	return jsdoc2md.render({ data });
})
.then((result) => {
//	console.log(result);
	fs.writeFile('./test.md', result);
});
