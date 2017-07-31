import * as semver from 'semver';
import memoize = require('lodash.memoize');

// TODO: PR to DefinitelyTyped project
declare module 'semver' {
	function parse(version: string, loose?: boolean): semver.SemVer;
}

const trimOsText = (version: string) => {
	return version.replace(/^resin\sos\s/gi, '')
	.replace(/\s+\(\w+\)$/, '');
};

const safeSemver = (version: string) => {
	return version.replace(/(\.[0-9]+)\.rev/, '$1+rev');
};

const getRev = (osVersion: string) => {
	const rev = semver.parse(osVersion).build.map(function(metadataPart) {
		const matches = /rev(\d+)/.exec(metadataPart);
		return matches && matches[0] || null;
	})
	.filter((x) => x != null)[0];

	if (rev != null) {
		return parseInt(rev, 10);
	} else {
		return 0;
	}
};

const isDevelopmentVersion = (version: string) => {
	return /(\.|\+|-)dev/.test(version);
};

/**
 * @summary Compare order of versions
 * @name compare
 * @public
 * @function
 *
 * @description Accepts string or null values and compares them, returning a number
 * indicating sort order. Values are parsed for valid semver strings.
 *
 * @param {string|null} versionA - The first version to compare
 * @param {string|null} versionB - The second version to compare
 *
 * @returns {number} one of `1`, `0`, or `-1`. null values are always weighted below
 * string values, and string values are always weighted below valid semver values.
 * If both values are invalid semver values, then the values are compared alphabetically
 *
 * @example
 * resinSemver.compare(null, 'Resin OS 2.0.0+rev4 (prod)'); //--> -1
 *
 * resinSemver.compare('Ubuntu dev', 'Resin OS 2.0.0+rev4 (prod)'); //--> -1
 *
 * resinSemver.compare('Version A', 'Version B'); //--> 1
 *
 * resinSemver.compare('Resin OS 1.16.0', 'Resin OS 2.0.0+rev4 (prod)'); //--> 1
 *
 * resinSemver.compare('Resin OS 2.0.0+rev4 (prod)', 'Resin OS 1.16.0'); //--> -1
 *
 * resinSemver.compare('Resin OS 1.16.0', 'Resin OS 1.16.0'); //--> 0
 */
export const compare = memoize((versionA: string | null, versionB: string | null) => {
	if (versionA === null && versionB === null) {
		return 0;
	}
	if (versionA === null && versionB !== null) {
		return -1;
	}
	if (versionA !== null && versionB === null) {
		return 1;
	}
	versionA = <string>versionA;
	versionB = <string>versionB;
	const isAValid = semver.valid(versionA);
	const isBValid = semver.valid(versionB);
	if (isAValid && !isBValid) {
		return 1;
	}
	if (!isAValid && isBValid) {
		return -1;
	}
	if (!isAValid && !isBValid) {
		if (versionA > versionB) {
			return -1;
		}
		if (versionA < versionB) {
			return 1;
		}
		return 0;
	}
	versionA = trimOsText(safeSemver(versionA));
	versionB = trimOsText(safeSemver(versionB));
	const semverResult = semver.rcompare(versionA, versionB);
	if (semverResult !== 0) {
		return semverResult;
	}
	const revA = getRev(versionA);
	const revB = getRev(versionB);
	if (revA !== revB) {
		return revB - revA;
	}
	const devA = Number(isDevelopmentVersion(versionA));
	const devB = Number(isDevelopmentVersion(versionB));
	if (devA !== devB) {
		return devA - devB;
	}
	return versionA.localeCompare(versionB);
}, (a: string, b: string) => `${a} && ${b}`);

/**
 * @summary Return the major version number
 * @name major
 * @public
 * @function
 *
 * @description Returns the major version number in a semver string.
 * If the version is not a valid semver string, or a valid semver string cannot be
 * found, it returns null.
 *
 * @param {string|null} version - The version string to evaluate
 *
 * @returns {number|null} - The major version number
 *
 * @example
 * resinSemver.major(null); //--> null
 *
 * resinSemver.major('4.5.1'); //--> 4
 *
 * resinSemver.major('Resin OS v2.0.5'); //--> 2
 *
 * resinSemver.major('Resin OS v1.24.0'); //--> 1
 *
 * resinSemver.major('Linux 14.04'); //--> null
 *
 * resinSemver.major('My development version'); //--> null
 */
export const major = (version: string | null): number | null => {
	if (!version) {
		return null;
	}

	version = trimOsText(safeSemver(version));

	if (semver.valid(version)) {
		return semver.major(version);
	}

	return null;
};
