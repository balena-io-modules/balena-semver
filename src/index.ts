import * as semver from 'semver';
import memoize = require('lodash.memoize');

// TODO: PR to DefinitelyTyped project
declare module 'semver' {
	function parse(version: string, loose?: boolean): semver.SemVer;
}

const trimOsText = (version: string) => {
	// Remove "Resin OS" text
	return version.replace(/^resin\sos\s+/gi, '')
	// Remove optional versioning, eg "(prod)", "(dev)"
	.replace(/\s+\(\w+\)$/, '')
	// Remove "v" prefix
	.replace(/^v/, '');
};

const safeSemver = (version: string) => {
	return version.replace(/(\.[0-9]+)\.rev/, '$1+rev');
};

const normalize = (version: string): string => trimOsText(safeSemver(version));

const getRev = (osVersion: string) => {
	const rev = semver.parse(osVersion).build.map(function(metadataPart) {
		const matches = /rev(\d+)/.exec(metadataPart);
		return matches && matches[1] || null;
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
 * indicating sort order. Values are parsed for valid semver strings. Sorts an array
 * of versions in ascending order if passed to `Array.sort()`.
 *
 *
 * @param {string|null} versionA - The first version to compare
 * @param {string|null} versionB - The second version to compare
 *
 * @returns {number} Returns `0` if `versionA == versionB`,
 * or `1` if `versionA` is greater, or `-1` if `versionB` is greater.
 * Null values are sorted before invalid semver values, and invalid semver values
 * are sorted before valid semver values
 * If both values are invalid semver values, then the values are compared alphabetically.
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
export const compare = memoize((versionA: string | null, versionB: string | null): number => {
	if (versionA === null && versionB === null) {
		return 0;
	}
	if (versionA === null && versionB !== null) {
		return -1;
	}
	if (versionA !== null && versionB === null) {
		return 1;
	}
	versionA = normalize(<string>versionA);
	versionB = normalize(<string>versionB);

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
			return 1;
		}
		if (versionA < versionB) {
			return -1;
		}
		return 0;
	}
	const semverResult = semver.compare(versionA, versionB);
	if (semverResult !== 0) {
		return semverResult;
	}
	const revA = getRev(versionA);
	const revB = getRev(versionB);
	if (revA !== revB) {
		return revA > revB ? 1 : -1;
	}
	const devA = Number(isDevelopmentVersion(versionA));
	const devB = Number(isDevelopmentVersion(versionB));
	if (devA !== devB) {
		return devA > devB ? -1 : 1;
	}
	return versionA.localeCompare(versionB);
}, (a: string, b: string) => `${a} && ${b}`);

/**
 * @summary Compare order of versions in reverse
 * @name rcompare
 * @public
 * @function
 *
 * @description The reverse of `.compare()`. Accepts string or null values and compares
 * them, returning a number indicating sort order. Values are parsed for valid semver
 * strings. Sorts an array of versions in descending order when passed to `Array.sort()`.
 *
 * @param {string|null} versionA - The first version to compare
 * @param {string|null} versionB - The second version to compare
 *
 * @returns {number} Returns `0` if `versionA == versionB`,
 * or `-1` if `versionA` is greater, or `1` if `versionB` is greater.
 * Valid semver values are sorted before invalid semver values, and invalid semver values are
 * sorted before null values.
 * If both values are non-null invalid semver values, then the values are compared alphabetically.
 *
 * @example
 * resinSemver.rcompare(null, 'Resin OS 2.0.0+rev4 (prod)'); //--> 1
 *
 * resinSemver.rcompare('Ubuntu dev', 'Resin OS 2.0.0+rev4 (prod)'); //--> 1
 *
 * resinSemver.rcompare('Version A', 'Version B'); //--> -1
 *
 * resinSemver.rcompare('Resin OS 1.16.0', 'Resin OS 2.0.0+rev4 (prod)'); //--> -1
 *
 * resinSemver.rcompare('Resin OS 2.0.0+rev4 (prod)', 'Resin OS 1.16.0'); //--> 1
 *
 * resinSemver.rcompare('Resin OS 1.16.0', 'Resin OS 1.16.0'); //--> 0
 */
export const rcompare = (versionA: string | null, versionB: string | null): number => {
	return 0 - compare(versionA, versionB);
};

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

/**
 * @summary Return prerelease components
 * @name prerelease
 * @public
 * @function
 *
 * @description Returns an array of prerelease components, or null if none exist
 *
 * @param {string|null} version - The version string to evaluate
 *
 * @returns {Array.<string|number>|null} - An array of prerelease component, or null if none exist
 *
 * @example
 * resinSemver.prerelease('1.16.0-alpha.1'); //--> ['alpha', '1']
 *
 * resinSemver.prerelease('1.16.0'); //--> null
 *
 * resinSemver.prerelease('Resin OS 2.0.0-rc5.rev1'); //--> ['rc5', 'rev1']
 *
 * resinSemver.prerelease('Resin OS 2.0.0'); //--> null
 *
 * resinSemver.prerelease('My dev version'); //--> null
 *
 * resinSemver.prerelease('Linux 14.04'); //--> null
 *
 * resinSemver.prerelease('Software version 42.3.20170726.72bbcf8'); //--> null
 *
 * resinSemver.prerelease(null)); //--> null
 */
export const prerelease = (version: string | null) => {
	if (!version) {
		return null;
	}

	version = trimOsText(safeSemver(version));

	return semver.prerelease(version);
};

/**
 * @summary Check if a version is greater than or equal to another
 * @name gte
 * @public
 * @function
 *
 * @description Returns true if versionA is greater than or equal to versionB.
 * Valid semver versions are always weighted above non semver strings.
 * Non-semver strings are compared alphabetically.
 *
 * @param {string|null} versionA - The version string to compare against
 * @param {string|null} versionB - The version string to compare to versionA
 *
 * @returns {boolean} - true if versionA is greater than or equal to versionB, otherwise false.
 *
 * @example
 * resinSemver.gte('2.0.5', '1.16.0'); //--> true
 *
 * resinSemver.gte('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2'); //--> true
 *
 * resinSemver.gte('1.16.0', 'Resin OS 2.0.2+rev2'); //--> false
 */
export const gte = (versionA: string | null, versionB: string | null): boolean => {
	return compare(versionA, versionB) >= 0;
};

/**
 * @summary Check if a version is greater than another
 * @name gt
 * @public
 * @function
 *
 * @description Returns true if versionA is greater than versionB.
 * Valid semver versions are always weighted above non semver strings.
 * Non-semver strings are compared alphabetically.
 *
 * @param {string|null} versionA - The version string to compare against
 * @param {string|null} versionB - The version string to compare to versionA
 *
 *
 * @returns {boolean} - true if versionA is greater than versionB, otherwise false.
 *
 * @example
 * resinSemver.gt('2.0.5', '1.16.0'); //--> true
 *
 * resinSemver.gt('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2'); //--> true
 *
 * resinSemver.gt('1.16.0', 'Resin OS 2.0.2+rev2'); //--> false
 *
 * resinSemver.gt('Resin OS 2.0.2', 'Resin OS 2.0.2'); //--> false
 */
export const gt = (versionA: string | null, versionB: string | null): boolean => {
	return compare(versionA, versionB) > 0;
};

/**
 * @summary Check if a version is less than another
 * @name lt
 * @public
 * @function
 *
 * @description Returns true if versionA is less than versionB.
 * Valid semver versions are always weighted above non semver strings.
 * Non-semver strings are compared alphabetically.
 *
 * @param {string|null} versionA - The version string to compare against
 * @param {string|null} versionB - The version string to compare to versionA
 *
 * @returns {boolean} - true if versionA is less than versionB, otherwise false.
 *
 * @example
 * resinSemver.lt('2.0.5', '1.16.0'); //--> false
 *
 * resinSemver.lt('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2'); //--> false
 *
 * resinSemver.lt('1.16.0', 'Resin OS 2.0.2+rev2'); //--> true
 *
 * resinSemver.lt('Resin OS 2.0.2', 'Resin OS 2.0.2'); //--> false
 *
 * resinSemver.lt('Version A', 'Version B'); //--> true
 */
export const lt = (versionA: string | null, versionB: string | null): boolean => {
	return compare(versionA, versionB) < 0;
};
