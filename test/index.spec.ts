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

		it('should return null when the version contains no valid semver value', () => {
			expect(semver.major('My dev version')).to.equal(null);
			expect(semver.major('Linux 14.04')).to.equal(null);
			expect(semver.major('Software version 42.3.20170726.72bbcf8')).to.equal(null);
		});
	});

	describe('.prerelease()', () => {
		it('should return an array of prerelease components when provided a semver string', () => {
			expect(semver.prerelease('1.16.0-alpha.1')).to.eql(['alpha', 1]);
		});

		it('should return null when provided with a semver string that has no prerelease segment', () => {
			expect(semver.prerelease('1.16.0')).to.eql(null);
		});

		it('should return an array of prerelease components when provided a resinOS prefixed version', () => {
			expect(semver.prerelease('Resin OS 2.0.0-rc5.rev1')).to.eql(['rc5', 'rev1']);
		});

		it('should return null when provided a resinOS prefixed version that has no prerelease segment', () => {
			expect(semver.prerelease('Resin OS 2.0.0')).to.equal(null);
		});

		it('should return null when provided with an invalid version', () => {
			expect(semver.prerelease('My dev version')).to.equal(null);
			expect(semver.prerelease('Linux 14.04')).to.equal(null);
			expect(semver.prerelease('Software version 42.3.20170726.72bbcf8')).to.equal(null);
		});

		it('should return null when provided with a null value', () => {
			expect(semver.prerelease(null)).to.equal(null);
		});
	});
});
