import * as semver from '../src';

import { versions } from './versions';

import { expect } from 'chai';

describe('resin-semver', () => {
	describe('.compare()', () => {
		it('should not throw when provided with a version', () => {
			versions.forEach((version) => {
				expect(() => semver.compare(version, version)).to.not.throw();
			});
		});
	});
});
