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

	describe('.major()', () => {
		it('should correctly match valid semver versions', () => {
			expect(semver.major('4.5.1')).to.equal(4);
		});

		it('should correctly match resinOS prefixed versions', () => {
			expect(semver.major('Resin OS v2.0.5')).to.equal(2);
			expect(semver.major('Resin OS 2.0.2+rev2')).to.equal(2);
			expect(semver.major('Resin OS 2.0.0.rev1 (prod)')).to.equal(2);
			expect(semver.major('Resin OS 2.0.0-rc5.rev1')).to.equal(2);
		});

		it('should return null when version is `null`', () => {
			expect(semver.major(null)).to.equal(null);
		});

		it('should return null when the version is contains no valid semver value', () => {
			expect(semver.major('My dev version')).to.equal(null);
			expect(semver.major('Linux 14.04')).to.equal(null);
		});
	});
});
