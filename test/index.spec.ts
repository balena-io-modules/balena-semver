import { expect } from 'chai';
import sortBy = require('lodash.sortby');
import * as semver from '../src';
import { versions } from './versions';

describe('resin-semver', () => {
	describe('.compare()', () => {
		it('should not throw when provided with a version', () => {
			versions.forEach(version => {
				expect(() => semver.compare(version, version)).to.not.throw();
			});
		});

		it('should correctly sort lists of versions', () => {
			expect(sortBy(versions.slice(), semver.compare)).to.eql(versions);
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

		it('should correctly compare Balena formatted versions', () => {
			expect(semver.compare('balenaOS 2.0.5', 'balenaOS 2.0.2+rev2')).to.equal(1);
			expect(semver.compare('balenaOS 1.16.0', 'balenaOS 2.0.2 (prod)')).to.equal(-1);
			expect(semver.compare('balenaOS 1.16.0', 'balenaOS 1.16.0')).to.equal(0);
		});

		it('should correctly compare Balena formatted versions to Resin formatted versions', () => {
			expect(semver.compare('balenaOS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(1);
			expect(semver.compare('balenaOS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(-1);
			expect(semver.compare('balenaOS 1.16.0', 'Resin OS 1.16.0')).to.equal(0);
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

		it('should correctly compare undefined values', () => {
			expect(semver.compare('2.0.5', undefined)).to.equal(1);
			expect(semver.compare(undefined, '1.16.0')).to.equal(-1);
			expect(semver.compare('Resin OS 1.16.0', undefined)).to.equal(1);
			expect(semver.compare(undefined, 'Resin OS 1.16.0')).to.equal(-1);
			expect(semver.compare('Linux 14.04', undefined)).to.equal(1);
			expect(semver.compare(undefined, 'Linux 14.04')).to.equal(-1);
			expect(semver.compare(undefined, undefined)).to.equal(0);
		});

		it('should correctly compare "rev" values', () => {
			expect(semver.compare('2.0.0+rev6', '2.0.0+rev3')).to.equal(1);
			expect(semver.compare('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(1);
			expect(semver.compare('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(1);
			expect(semver.compare('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(-1);
			expect(semver.compare('2.0.0+rev3', '2.0.0+rev3')).to.equal(0);
			expect(semver.compare('2.0.0+rev1', '2.0.0+rev11')).to.equal(-1);
			expect(semver.compare('2.0.0+rev2', '2.0.0+rev11')).to.equal(-1);
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

		it('should correctly compare "(dev)" and "(prod)" versions without revisions', () => {
			expect(semver.compare('Resin OS 2.0.0', 'Resin OS 2.0.0 (dev)')).to.equal(1);
			expect(semver.compare('Resin OS 2.0.0', 'Resin OS 2.0.0 (prod)')).to.equal(-1);
			expect(semver.compare('Resin OS 2.0.0 (dev)', 'Resin OS 2.0.0 (prod)')).to.equal(-1);

			expect(semver.compare('Resin OS 2.0.0', 'Resin OS 2.0.0-prod')).to.equal(1);
			expect(semver.compare('Resin OS 2.0.0', 'Resin OS 2.0.0.prod')).to.equal(-1);
			expect(semver.compare('Resin OS 2.0.0', 'Resin OS 2.0.0+prod')).to.equal(-1);
			expect(semver.compare('Resin OS 2.0.0 (dev)', 'Resin OS 2.0.0+prod')).to.equal(-1);

			expect(semver.compare('Resin OS 2.0.0.dev', 'Resin OS 2.0.0+dev')).to.equal(0);
			expect(semver.compare('Resin OS 2.0.0.dev', 'Resin OS 2.0.0 (dev)')).to.equal(0);
			expect(semver.compare('Resin OS 2.0.0+dev', 'Resin OS 2.0.0 (dev)')).to.equal(0);

			expect(semver.compare('Resin OS 2.0.0.prod', 'Resin OS 2.0.0+prod')).to.equal(0);
			expect(semver.compare('Resin OS 2.0.0.prod', 'Resin OS 2.0.0 (prod)')).to.equal(0);
			expect(semver.compare('Resin OS 2.0.0+prod', 'Resin OS 2.0.0 (prod)')).to.equal(0);
		});

		it('should correctly compare "(dev)" and "(prod)" versions of the same revision', () => {
			expect(semver.compare('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3 (dev)')).to.equal(1);
			expect(semver.compare('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3 (prod)')).to.equal(-1);
			expect(semver.compare('Resin OS 2.0.0+rev3 (dev)', 'Resin OS 2.0.0+rev3 (prod)')).to.equal(-1);

			expect(semver.compare('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.prod')).to.equal(-1);
			expect(semver.compare('Resin OS 2.0.0+rev3 (dev)', 'Resin OS 2.0.0+rev3+prod')).to.equal(1); // B is invalid
		});
	});

	describe('.rcompare()', () => {
		it('should not throw when provided with a version', () => {
			versions.forEach(version => {
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

		it('should correctly compare undefined values', () => {
			expect(semver.rcompare('2.0.5', undefined)).to.equal(-1);
			expect(semver.rcompare(undefined, '1.16.0')).to.equal(1);
			expect(semver.rcompare('Resin OS 1.16.0', undefined)).to.equal(-1);
			expect(semver.rcompare(undefined, 'Resin OS 1.16.0')).to.equal(1);
			expect(semver.rcompare('Linux 14.04', undefined)).to.equal(-1);
			expect(semver.rcompare(undefined, 'Linux 14.04')).to.equal(1);
			expect(semver.rcompare(undefined, undefined)).to.equal(0);
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

		it('should return null when version is `undefined`', () => {
			expect(semver.major(undefined)).to.equal(null);
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

		it('should return null when provided with an undefined value', () => {
			expect(semver.prerelease(undefined)).to.equal(null);
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

		it('should correctly compare undefined values', () => {
			expect(semver.gte('2.0.5', undefined)).to.equal(true);
			expect(semver.gte(undefined, '1.16.0')).to.equal(false);
			expect(semver.gte('Resin OS 1.16.0', undefined)).to.equal(true);
			expect(semver.gte(undefined, 'Resin OS 1.16.0')).to.equal(false);
			expect(semver.gte('Linux 14.04', undefined)).to.equal(true);
			expect(semver.gte(undefined, 'Linux 14.04')).to.equal(false);
			expect(semver.gte(undefined, undefined)).to.equal(true);
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

		it('should correctly compare undefined values', () => {
			expect(semver.gt('2.0.5', undefined)).to.equal(true);
			expect(semver.gt(undefined, '1.16.0')).to.equal(false);
			expect(semver.gt('Resin OS 1.16.0', undefined)).to.equal(true);
			expect(semver.gt(undefined, 'Resin OS 1.16.0')).to.equal(false);
			expect(semver.gt('Linux 14.04', undefined)).to.equal(true);
			expect(semver.gt(undefined, 'Linux 14.04')).to.equal(false);
			expect(semver.gt(undefined, undefined)).to.equal(false);
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

		it('should correctly compare undefined values', () => {
			expect(semver.lt('2.0.5', undefined)).to.equal(false);
			expect(semver.lt(undefined, '1.16.0')).to.equal(true);
			expect(semver.lt('Resin OS 1.16.0', undefined)).to.equal(false);
			expect(semver.lt(undefined, 'Resin OS 1.16.0')).to.equal(true);
			expect(semver.lt('Linux 14.04', undefined)).to.equal(false);
			expect(semver.lt(undefined, 'Linux 14.04')).to.equal(true);
			expect(semver.lt(undefined, undefined)).to.equal(false);
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

	describe('.satisfies()', () => {
		it('should correctly evaluate valid semver values', () => {
			expect(semver.satisfies('2.0.5', '^2.0.0')).to.equal(true);
			expect(semver.satisfies('1.16.0', '^2.0.0')).to.equal(false);
		});

		it('should correctly evaluate Resin formatted versions', () => {
			expect(semver.satisfies('Resin OS 2.0.2+rev2', '^2.0.0')).to.equal(true);
			expect(semver.satisfies('Resin OS 2.0.2 (prod)', '^2.0.0')).to.equal(true);
			expect(semver.satisfies('Resin OS 1.16.0', '^2.0.0')).to.equal(false);
		});

		it('should always return false when provided with an invalid semver value', () => {
			expect(semver.satisfies('Linux 14.04', '^2.0.0')).to.equal(false);
			expect(semver.satisfies('A development version', '^2.0.0')).to.equal(false);
			expect(semver.satisfies('Version A', '^2.0.0')).to.equal(false);
			expect(semver.satisfies('Linux 14.04', '*')).to.equal(false);
			expect(semver.satisfies('Linux 14.04', '< 1.0.0')).to.equal(false);
		});

		it('should correctly evaluate null values', () => {
			expect(semver.satisfies(null, '^2.0.0')).to.equal(false);
		});

		it('should correctly evaluate undefined values', () => {
			expect(semver.satisfies(undefined, '^2.0.0')).to.equal(false);
		});
	});

	describe('.maxSatisfying()', () => {
		it('should return the correct version', () => {
			expect(semver.maxSatisfying(versions, '1.1.*')).to.equal('Resin OS 1.1.4');
			expect(semver.maxSatisfying(versions, '^2.0.0')).to.equal('Resin OS 2.14.0');
			expect(semver.maxSatisfying(versions, '< 1.0.0')).to.equal(null);
		});

		it('should return the first version found if multiple versions have equally high values', () => {
			expect(semver.maxSatisfying(['1.0.0', 'Resin OS 1.1.4', '1.1.4'], '1.1.*')).to.equal('Resin OS 1.1.4');
		});

		it('should normalize versions used in range parameter', () => {
			expect(semver.maxSatisfying(versions, '2.0.0.rev1')).to.equal('Resin OS 2.0.0+rev11');
			expect(semver.maxSatisfying(versions, '^ Resin OS 2.0.0 (prod)')).to.equal('Resin OS 2.14.0');
			expect(semver.maxSatisfying(versions, '< Resin OS v1.0.0')).to.equal(null);
			expect(semver.maxSatisfying(versions, 'Resin OS v1.1.*')).to.equal('Resin OS 1.1.4');
		});
	});

	describe('.parse()', () => {
		it('should correctly parse valid semver values', () => {
			expect(semver.parse('2.0.5')).to.deep.include({
				raw: '2.0.5',
				major: 2,
				minor: 0,
				patch: 5,
				version: '2.0.5',
				prerelease: [],
				build: [],
			});
		});

		it('should correctly parse Resin formatted versions', () => {
			expect(semver.parse('Resin OS v2.0.2+rev2')).to.deep.include({
				raw: 'Resin OS v2.0.2+rev2',
				major: 2,
				minor: 0,
				patch: 2,
				version: '2.0.2',
				prerelease: [],
				build: ['rev2'],
			});

			expect(semver.parse('Resin OS v2.0.2 (prod)')).to.deep.include({
				raw: 'Resin OS v2.0.2 (prod)',
				major: 2,
				minor: 0,
				patch: 2,
				version: '2.0.2',
				prerelease: [],
				build: ['prod'],
			});

			expect(semver.parse('Resin OS v2.0.2.prod')).to.deep.include({
				raw: 'Resin OS v2.0.2.prod',
				major: 2,
				minor: 0,
				patch: 2,
				version: '2.0.2',
				prerelease: [],
				build: ['prod'],
			});

			expect(semver.parse('Resin OS 2.0.0-rc5.rev1')).to.deep.include({
				raw: 'Resin OS 2.0.0-rc5.rev1',
				major: 2,
				minor: 0,
				patch: 0,
				version: '2.0.0-rc5.rev1',
				prerelease: ['rc5', 'rev1'],
				build: [],
			});

			expect(semver.parse('Resin OS 2.3.0+rev1.prod')).to.deep.include({
				raw: 'Resin OS 2.3.0+rev1.prod',
				major: 2,
				minor: 3,
				patch: 0,
				version: '2.3.0',
				prerelease: [],
				build: ['rev1', 'prod'],
			});

			expect(semver.parse('Resin OS v2.3.0-a.b.c (prod)')).to.deep.include({
				raw: 'Resin OS v2.3.0-a.b.c (prod)',
				major: 2,
				minor: 3,
				patch: 0,
				version: '2.3.0-a.b.c',
				prerelease: ['a', 'b', 'c'],
				build: ['prod'],
			});

			expect(semver.parse('Resin OS 2.3.0-a.b.c+d.e.f (prod)')).to.deep.include({
				raw: 'Resin OS 2.3.0-a.b.c+d.e.f (prod)',
				major: 2,
				minor: 3,
				patch: 0,
				version: '2.3.0-a.b.c',
				prerelease: ['a', 'b', 'c'],
				build: ['d', 'e', 'f', 'prod'],
			});

			expect(semver.parse('Resin OS 2.3.0+a.b.c (prod)')).to.deep.include({
				raw: 'Resin OS 2.3.0+a.b.c (prod)',
				major: 2,
				minor: 3,
				patch: 0,
				version: '2.3.0',
				prerelease: [],
				build: ['a', 'b', 'c', 'prod'],
			});
		});

		it('should correctly parse invalid semver values', () => {
			expect(semver.parse('Linux 14.04')).to.equal(null);
			expect(semver.parse('A development version')).to.equal(null);
			expect(semver.parse('Version A')).to.equal(null);
		});

		it('should correctly parse null values', () => {
			expect(semver.parse(null)).to.equal(null);
		});

		it('should correctly parse undefined values', () => {
			expect(semver.parse(undefined)).to.equal(null);
		});
	});

	describe('.valid()', () => {
		it('should return null for invalid semver values', () => {
			expect(semver.valid(null)).to.equal(null);
			expect(semver.valid(undefined)).to.equal(null);
			expect(semver.valid('')).to.equal(null);
			expect(semver.valid('foobar')).to.equal(null);
			expect(semver.valid('12345')).to.equal(null);
			expect(semver.valid('1.2.3.4.5')).to.equal(null);
		});

		it('should correctly parse valid values', () => {
			expect(semver.valid('Resin OS 1.0.0-pre')).to.equal('1.0.0-pre');
			expect(semver.valid('Resin OS 1.0.5 (fido)')).to.equal('1.0.5');
			expect(semver.valid('Resin OS 2.0.0-beta.8')).to.equal('2.0.0-beta.8');
			expect(semver.valid('Resin OS 2.0.0-beta10.rev1')).to.equal('2.0.0-beta10.rev1');
			expect(semver.valid('Resin OS 2.0.0+rev3')).to.equal('2.0.0');
			expect(semver.valid('Resin OS 2.0.0.rev1 (prod)')).to.equal('2.0.0');
			expect(semver.valid('Resin OS 2.0.0+rev4 (dev)')).to.equal('2.0.0');
			expect(semver.valid('2.0.6+rev3.dev')).to.equal('2.0.6');
		});
	});

	describe('.inc()', () => {
		it('should return null for invalid semver values', () => {
			expect(semver.inc(null, 'major')).to.equal(null);
			expect(semver.inc(undefined, 'major')).to.equal(null);
			expect(semver.inc('', 'major')).to.equal(null);
			expect(semver.inc('foobar', 'major')).to.equal(null);
			expect(semver.inc('12345', 'major')).to.equal(null);
			expect(semver.inc('1.2.3.4.5', 'major')).to.equal(null);
		});

		it("should correctly increment valid values by a 'premajor' release", () => {
			expect(semver.inc('Resin OS 1.0.0-pre', 'premajor')).to.equal('2.0.0-0');
			expect(semver.inc('Resin OS 1.0.5 (fido)', 'premajor')).to.equal('2.0.0-0');
			expect(semver.inc('Resin OS 2.0.0-beta.8', 'premajor')).to.equal('3.0.0-0');
			expect(semver.inc('Resin OS 2.0.0-beta10.rev1', 'premajor')).to.equal('3.0.0-0');
			expect(semver.inc('Resin OS 2.0.0+rev3', 'premajor')).to.equal('3.0.0-0');
			expect(semver.inc('Resin OS 2.0.0.rev1 (prod)', 'premajor')).to.equal('3.0.0-0');
			expect(semver.inc('Resin OS 2.0.0+rev4 (dev)', 'premajor')).to.equal('3.0.0-0');
			expect(semver.inc('2.0.6+rev3.dev', 'premajor')).to.equal('3.0.0-0');
		});

		it("should correctly increment valid values by a 'preminor' release", () => {
			expect(semver.inc('Resin OS 1.0.0-pre', 'preminor')).to.equal('1.1.0-0');
			expect(semver.inc('Resin OS 1.0.5 (fido)', 'preminor')).to.equal('1.1.0-0');
			expect(semver.inc('Resin OS 2.0.0-beta.8', 'preminor')).to.equal('2.1.0-0');
			expect(semver.inc('Resin OS 2.0.0-beta10.rev1', 'preminor')).to.equal('2.1.0-0');
			expect(semver.inc('Resin OS 2.0.0+rev3', 'preminor')).to.equal('2.1.0-0');
			expect(semver.inc('Resin OS 2.1.0.rev1 (prod)', 'preminor')).to.equal('2.2.0-0');
			expect(semver.inc('Resin OS 2.0.0+rev4 (dev)', 'preminor')).to.equal('2.1.0-0');
			expect(semver.inc('2.0.6+rev3.dev', 'preminor')).to.equal('2.1.0-0');
		});

		it("should correctly increment valid values by a 'prepatch' release", () => {
			expect(semver.inc('Resin OS 1.0.0-pre', 'prepatch')).to.equal('1.0.1-0');
			expect(semver.inc('Resin OS 1.0.5 (fido)', 'prepatch')).to.equal('1.0.6-0');
			expect(semver.inc('Resin OS 2.0.0-beta.8', 'prepatch')).to.equal('2.0.1-0');
			expect(semver.inc('Resin OS 2.0.0-beta10.rev1', 'prepatch')).to.equal('2.0.1-0');
			expect(semver.inc('Resin OS 2.0.0+rev3', 'prepatch')).to.equal('2.0.1-0');
			expect(semver.inc('Resin OS 2.0.0.rev1 (prod)', 'prepatch')).to.equal('2.0.1-0');
			expect(semver.inc('Resin OS 2.0.0+rev4 (dev)', 'prepatch')).to.equal('2.0.1-0');
			expect(semver.inc('2.0.6+rev3.dev', 'prepatch')).to.equal('2.0.7-0');
		});

		it("should correctly increment valid values by a 'prerelease' release", () => {
			expect(semver.inc('Resin OS 1.0.0-pre', 'prerelease')).to.equal('1.0.0-pre.0');
			expect(semver.inc('Resin OS 1.0.5 (fido)', 'prerelease')).to.equal('1.0.6-0');
			expect(semver.inc('Resin OS 2.0.0-beta.8', 'prerelease')).to.equal('2.0.0-beta.9');
			expect(semver.inc('Resin OS 2.0.0-beta10.rev1', 'prerelease')).to.equal('2.0.0-beta10.rev1.0');
			expect(semver.inc('Resin OS 2.0.0+rev3', 'prerelease')).to.equal('2.0.1-0');
			expect(semver.inc('Resin OS 2.0.0.rev1 (prod)', 'prerelease')).to.equal('2.0.1-0');
			expect(semver.inc('Resin OS 2.0.0+rev4 (dev)', 'prerelease')).to.equal('2.0.1-0');
			expect(semver.inc('2.0.6+rev3.dev', 'prerelease')).to.equal('2.0.7-0');
		});

		it("should correctly increment valid values by a 'major' release", () => {
			expect(semver.inc('Resin OS 1.0.0-pre', 'major')).to.equal('1.0.0');
			expect(semver.inc('Resin OS 1.0.5 (fido)', 'major')).to.equal('2.0.0');
			expect(semver.inc('Resin OS 2.0.0-beta.8', 'major')).to.equal('2.0.0');
			expect(semver.inc('Resin OS 2.0.0-beta10.rev1', 'major')).to.equal('2.0.0');
			expect(semver.inc('Resin OS 2.0.0+rev3', 'major')).to.equal('3.0.0');
			expect(semver.inc('Resin OS 2.0.0.rev1 (prod)', 'major')).to.equal('3.0.0');
			expect(semver.inc('Resin OS 2.0.0+rev4 (dev)', 'major')).to.equal('3.0.0');
			expect(semver.inc('2.0.6+rev3.dev', 'major')).to.equal('3.0.0');
		});

		it("should correctly increment valid values by a 'minor' release", () => {
			expect(semver.inc('Resin OS 1.0.0-pre', 'minor')).to.equal('1.0.0');
			expect(semver.inc('Resin OS 1.0.5 (fido)', 'minor')).to.equal('1.1.0');
			expect(semver.inc('Resin OS 2.0.0-beta.8', 'minor')).to.equal('2.0.0');
			expect(semver.inc('Resin OS 2.0.0-beta10.rev1', 'minor')).to.equal('2.0.0');
			expect(semver.inc('Resin OS 2.0.0+rev3', 'minor')).to.equal('2.1.0');
			expect(semver.inc('Resin OS 2.0.0.rev1 (prod)', 'minor')).to.equal('2.1.0');
			expect(semver.inc('Resin OS 2.0.0+rev4 (dev)', 'minor')).to.equal('2.1.0');
			expect(semver.inc('2.0.6+rev3.dev', 'minor')).to.equal('2.1.0');
		});

		it("should correctly increment valid values by a 'patch' release", () => {
			expect(semver.inc('Resin OS 1.0.0-pre', 'patch')).to.equal('1.0.0');
			expect(semver.inc('Resin OS 1.0.5 (fido)', 'patch')).to.equal('1.0.6');
			expect(semver.inc('Resin OS 2.0.0-beta.8', 'patch')).to.equal('2.0.0');
			expect(semver.inc('Resin OS 2.0.0-beta10.rev1', 'patch')).to.equal('2.0.0');
			expect(semver.inc('Resin OS 2.0.0+rev3', 'patch')).to.equal('2.0.1');
			expect(semver.inc('Resin OS 2.0.0.rev1 (prod)', 'patch')).to.equal('2.0.1');
			expect(semver.inc('Resin OS 2.0.0+rev4 (dev)', 'patch')).to.equal('2.0.1');
			expect(semver.inc('2.0.6+rev3.dev', 'patch')).to.equal('2.0.7');
		});
	});
});
