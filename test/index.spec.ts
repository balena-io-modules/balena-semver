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

		it('should correctly compare valid semver values', () => {
			expect(semver.compare('2.0.5', '1.16.0')).to.equal(1);
			expect(semver.compare('2.0.5', '2.0.5')).to.equal(0);
			expect(semver.compare('1.16.0', '2.0.5')).to.equal(-1);
		});

		it('should correctly compare valid semver values to Resin formatted versions', () => {
			expect(semver.compare('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(1);
			expect(semver.compare('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(-1);
			expect(semver.compare('1.16.0', 'Resin OS v1.16.0')).to.equal(0);
			expect(semver.compare('Resin OS 1.16.0', '2.0.2')).to.equal(-1);
			expect(semver.compare('Resin OS 1.16.0', '1.16.0')).to.equal(0);
			expect(semver.compare('Resin OS 2.0.2', '1.16.0')).to.equal(1);
		});

		it('should correctly compare Resin formatted versions', () => {
			expect(semver.compare('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(1);
			expect(semver.compare('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(-1);
			expect(semver.compare('Resin OS 1.16.0', 'Resin OS 1.16.0')).to.equal(0);
		});

		it('should correctly compare invalid semver values', () => {
			expect(semver.compare('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(-1);
			expect(semver.compare('Linux 14.04', 'A development version')).to.equal(1);
			expect(semver.compare('Version B', 'Version A')).to.equal(1);
			expect(semver.compare('Version A', 'Version A')).to.equal(0);
		});

		it('should correctly compare null values', () => {
			expect(semver.compare('2.0.5', null)).to.equal(1);
			expect(semver.compare(null, '1.16.0')).to.equal(-1);
			expect(semver.compare('Resin OS 1.16.0', null)).to.equal(1);
			expect(semver.compare(null, 'Resin OS 1.16.0')).to.equal(-1);
			expect(semver.compare('Linux 14.04', null)).to.equal(1);
			expect(semver.compare(null, 'Linux 14.04')).to.equal(-1);
			expect(semver.compare(null, null)).to.equal(0);
		});

		it('should correctly compare "rev" values', () => {
			expect(semver.compare('2.0.0+rev6', '2.0.0+rev3')).to.equal(1);
			expect(semver.compare('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(1);
			expect(semver.compare('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(1);
			expect(semver.compare('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(-1);
			expect(semver.compare('2.0.0+rev3', '2.0.0+rev3')).to.equal(0);
		});

		it('should correctly compare ".dev" versions', () => {
			expect(semver.compare('2.0.0', '2.0.0+dev')).to.equal(1);
			expect(semver.compare('2.0.0', '2.0.0-dev')).to.equal(1);
			expect(semver.compare('2.0.0', '2.0.0.dev')).to.equal(1);
			expect(semver.compare('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(1);
			expect(semver.compare('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(-1);
			expect(semver.compare('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(0);
			expect(semver.compare('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(1);
			expect(semver.compare('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(-1);
			expect(semver.compare('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(0);
			expect(semver.compare('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(1);
			expect(semver.compare('Resin OS 2.0.0.dev', '2.0.0')).to.equal(-1);
			expect(semver.compare('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(0);
		});
	});

	describe('.rcompare()', () => {
		it('should not throw when provided with a version', () => {
			versions.forEach((version) => {
				expect(() => semver.rcompare(version, version)).to.not.throw();
			});
		});

		it('should correctly compare valid semver values', () => {
			expect(semver.rcompare('2.0.5', '1.16.0')).to.equal(-1);
			expect(semver.rcompare('2.0.5', '2.0.5')).to.equal(0);
			expect(semver.rcompare('1.16.0', '2.0.5')).to.equal(1);
		});

		it('should correctly compare valid semver values to Resin formatted versions', () => {
			expect(semver.rcompare('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(-1);
			expect(semver.rcompare('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(1);
			expect(semver.rcompare('1.16.0', 'Resin OS v1.16.0')).to.equal(0);
			expect(semver.rcompare('Resin OS 1.16.0', '2.0.2')).to.equal(1);
			expect(semver.rcompare('Resin OS 1.16.0', '1.16.0')).to.equal(0);
			expect(semver.rcompare('Resin OS 2.0.2', '1.16.0')).to.equal(-1);
		});

		it('should correctly compare Resin formatted versions', () => {
			expect(semver.rcompare('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(-1);
			expect(semver.rcompare('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(1);
			expect(semver.rcompare('Resin OS 1.16.0', 'Resin OS 1.16.0')).to.equal(0);
		});

		it('should correctly compare invalid semver values', () => {
			expect(semver.rcompare('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(1);
			expect(semver.rcompare('Linux 14.04', 'A development version')).to.equal(-1);
			expect(semver.rcompare('Version B', 'Version A')).to.equal(-1);
			expect(semver.rcompare('Version A', 'Version A')).to.equal(0);
		});

		it('should correctly compare null values', () => {
			expect(semver.rcompare('2.0.5', null)).to.equal(-1);
			expect(semver.rcompare(null, '1.16.0')).to.equal(1);
			expect(semver.rcompare('Resin OS 1.16.0', null)).to.equal(-1);
			expect(semver.rcompare(null, 'Resin OS 1.16.0')).to.equal(1);
			expect(semver.rcompare('Linux 14.04', null)).to.equal(-1);
			expect(semver.rcompare(null, 'Linux 14.04')).to.equal(1);
			expect(semver.rcompare(null, null)).to.equal(0);
		});

		it('should correctly compare "rev" values', () => {
			expect(semver.rcompare('2.0.0+rev6', '2.0.0+rev3')).to.equal(-1);
			expect(semver.rcompare('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(-1);
			expect(semver.rcompare('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(-1);
			expect(semver.rcompare('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(1);
			expect(semver.rcompare('2.0.0+rev3', '2.0.0+rev3')).to.equal(0);
		});

		it('should correctly compare ".dev" versions', () => {
			expect(semver.rcompare('2.0.0', '2.0.0+dev')).to.equal(-1);
			expect(semver.rcompare('2.0.0', '2.0.0-dev')).to.equal(-1);
			expect(semver.rcompare('2.0.0', '2.0.0.dev')).to.equal(-1);
			expect(semver.rcompare('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(-1);
			expect(semver.rcompare('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(1);
			expect(semver.rcompare('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(0);
			expect(semver.rcompare('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(-1);
			expect(semver.rcompare('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(1);
			expect(semver.rcompare('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(0);
			expect(semver.rcompare('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(-1);
			expect(semver.rcompare('Resin OS 2.0.0.dev', '2.0.0')).to.equal(1);
			expect(semver.rcompare('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(0);
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

	describe('.gte()', () => {
		it('should correctly compare valid semver values', () => {
			expect(semver.gte('2.0.5', '1.16.0')).to.equal(true);
			expect(semver.gte('1.16.0', '2.0.5')).to.equal(false);
		});

		it('should correctly compare valid semver values to Resin formatted versions', () => {
			expect(semver.gte('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(true);
			expect(semver.gte('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(false);
			expect(semver.gte('Resin OS 1.16.0', '2.0.2')).to.equal(false);
			expect(semver.gte('Resin OS 1.16.0', '1.16.0')).to.equal(true);
		});

		it('should correctly compare Resin formatted versions', () => {
			expect(semver.gte('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(true);
			expect(semver.gte('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(false);
		});

		it('should correctly compare invalid semver values', () => {
			expect(semver.gte('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(false);
			expect(semver.gte('Linux 14.04', 'A development version')).to.equal(true);
			expect(semver.gte('Version B', 'Version A')).to.equal(true);
		});

		it('should correctly compare null values', () => {
			expect(semver.gte('2.0.5', null)).to.equal(true);
			expect(semver.gte(null, '1.16.0')).to.equal(false);
			expect(semver.gte('Resin OS 1.16.0', null)).to.equal(true);
			expect(semver.gte(null, 'Resin OS 1.16.0')).to.equal(false);
			expect(semver.gte('Linux 14.04', null)).to.equal(true);
			expect(semver.gte(null, 'Linux 14.04')).to.equal(false);
			expect(semver.gte(null, null)).to.equal(true);
		});

		it('should correctly compare "rev" values', () => {
			expect(semver.gte('2.0.0+rev6', '2.0.0+rev3')).to.equal(true);
			expect(semver.gte('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(true);
			expect(semver.gte('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(true);
			expect(semver.gte('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(false);
			expect(semver.gte('2.0.0+rev3', '2.0.0+rev3')).to.equal(true);
		});

		it('should correctly compare ".dev" versions', () => {
			expect(semver.gte('2.0.0', '2.0.0+dev')).to.equal(true);
			expect(semver.gte('2.0.0', '2.0.0-dev')).to.equal(true);
			expect(semver.gte('2.0.0', '2.0.0.dev')).to.equal(true);
			expect(semver.gte('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(true);
			expect(semver.gte('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(false);
			expect(semver.gte('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(true);
			expect(semver.gte('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(true);
			expect(semver.gte('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(false);
			expect(semver.gte('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(true);
			expect(semver.gte('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(true);
			expect(semver.gte('Resin OS 2.0.0.dev', '2.0.0')).to.equal(false);
			expect(semver.gte('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(true);
		});
	});

	describe('.gt()', () => {
		it('should correctly compare valid semver values', () => {
			expect(semver.gt('2.0.5', '1.16.0')).to.equal(true);
			expect(semver.gt('1.16.0', '2.0.5')).to.equal(false);
			expect(semver.gt('1.16.0', '1.16.0')).to.equal(false);
		});

		it('should correctly compare valid semver values to Resin formatted versions', () => {
			expect(semver.gt('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(true);
			expect(semver.gt('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(false);
			expect(semver.gt('Resin OS 1.16.0', '2.0.2')).to.equal(false);
			expect(semver.gt('Resin OS 1.16.0', '1.16.0')).to.equal(false);
		});

		it('should correctly compare Resin formatted versions', () => {
			expect(semver.gt('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(true);
			expect(semver.gt('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(false);
			expect(semver.gt('Resin OS 1.16.0', 'Resin OS 1.16.0')).to.equal(false);
		});

		it('should correctly compare invalid semver values', () => {
			expect(semver.gt('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(false);
			expect(semver.gt('Linux 14.04', 'A development version')).to.equal(true);
			expect(semver.gt('Version B', 'Version A')).to.equal(true);
			expect(semver.gt('Version A', 'Version A')).to.equal(false);
		});

		it('should correctly compare null values', () => {
			expect(semver.gt('2.0.5', null)).to.equal(true);
			expect(semver.gt(null, '1.16.0')).to.equal(false);
			expect(semver.gt('Resin OS 1.16.0', null)).to.equal(true);
			expect(semver.gt(null, 'Resin OS 1.16.0')).to.equal(false);
			expect(semver.gt('Linux 14.04', null)).to.equal(true);
			expect(semver.gt(null, 'Linux 14.04')).to.equal(false);
			expect(semver.gt(null, null)).to.equal(false);
		});

		it('should correctly compare "rev" values', () => {
			expect(semver.gt('2.0.0+rev6', '2.0.0+rev3')).to.equal(true);
			expect(semver.gt('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(true);
			expect(semver.gt('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(true);
			expect(semver.gt('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(false);
			expect(semver.gt('2.0.0+rev3', '2.0.0+rev3')).to.equal(false);
		});

		it('should correctly compare ".dev" versions', () => {
			expect(semver.gt('2.0.0', '2.0.0+dev')).to.equal(true);
			expect(semver.gt('2.0.0', '2.0.0-dev')).to.equal(true);
			expect(semver.gt('2.0.0', '2.0.0.dev')).to.equal(true);
			expect(semver.gt('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(true);
			expect(semver.gt('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(false);
			expect(semver.gt('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(false);
			expect(semver.gt('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(true);
			expect(semver.gt('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(false);
			expect(semver.gt('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(false);
			expect(semver.gt('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(true);
			expect(semver.gt('Resin OS 2.0.0.dev', '2.0.0')).to.equal(false);
			expect(semver.gt('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(false);
		});
	});

	describe('.lt()', () => {
		it('should correctly compare valid semver values', () => {
			expect(semver.lt('2.0.5', '1.16.0')).to.equal(false);
			expect(semver.lt('1.16.0', '2.0.5')).to.equal(true);
			expect(semver.lt('1.16.0', '1.16.0')).to.equal(false);
		});

		it('should correctly compare valid semver values to Resin formatted versions', () => {
			expect(semver.lt('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(false);
			expect(semver.lt('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(true);
			expect(semver.lt('Resin OS 1.16.0', '2.0.2')).to.equal(true);
			expect(semver.lt('Resin OS 1.16.0', '1.16.0')).to.equal(false);
		});

		it('should correctly compare Resin formatted versions', () => {
			expect(semver.lt('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(false);
			expect(semver.lt('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(true);
			expect(semver.lt('Resin OS 1.16.0', 'Resin OS 1.16.0')).to.equal(false);
		});

		it('should correctly compare invalid semver values', () => {
			expect(semver.lt('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(true);
			expect(semver.lt('Linux 14.04', 'A development version')).to.equal(false);
			expect(semver.lt('Version B', 'Version A')).to.equal(false);
			expect(semver.lt('Version A', 'Version A')).to.equal(false);
		});

		it('should correctly compare null values', () => {
			expect(semver.lt('2.0.5', null)).to.equal(false);
			expect(semver.lt(null, '1.16.0')).to.equal(true);
			expect(semver.lt('Resin OS 1.16.0', null)).to.equal(false);
			expect(semver.lt(null, 'Resin OS 1.16.0')).to.equal(true);
			expect(semver.lt('Linux 14.04', null)).to.equal(false);
			expect(semver.lt(null, 'Linux 14.04')).to.equal(true);
			expect(semver.lt(null, null)).to.equal(false);
		});

		it('should correctly compare "rev" values', () => {
			expect(semver.lt('2.0.0+rev6', '2.0.0+rev3')).to.equal(false);
			expect(semver.lt('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(false);
			expect(semver.lt('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(false);
			expect(semver.lt('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(true);
			expect(semver.lt('2.0.0+rev3', '2.0.0+rev3')).to.equal(false);
		});

		it('should correctly compare ".dev" versions', () => {
			expect(semver.lt('2.0.0', '2.0.0+dev')).to.equal(false);
			expect(semver.lt('2.0.0', '2.0.0-dev')).to.equal(false);
			expect(semver.lt('2.0.0', '2.0.0.dev')).to.equal(false);
			expect(semver.lt('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(false);
			expect(semver.lt('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(true);
			expect(semver.lt('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(false);
			expect(semver.lt('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(false);
			expect(semver.lt('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(true);
			expect(semver.lt('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(false);
			expect(semver.lt('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(false);
			expect(semver.lt('Resin OS 2.0.0.dev', '2.0.0')).to.equal(true);
			expect(semver.lt('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(false);
		});
	});
});
