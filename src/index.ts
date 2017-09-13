import memoize = require('lodash.memoize');
import * as semver from 'semver';

type VersionInput = string | null | undefined;

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
	const parsedVersion = semver.parse(osVersion);

	if (parsedVersion === null) {
		return 0;
	}

	const rev = parsedVersion.build.map(function(metadataPart) {
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
 * @param {string|null|undefined} versionA - The first version to compare
 * @param {string|null|undefined} versionB - The second version to compare
 *
 * @returns {number} Returns `0` if `versionA == versionB`,
 * or `1` if `versionA` is greater, or `-1` if `versionB` is greater.
 * Null values are sorted before invalid semver values, and invalid semver values
 * are sorted before valid semver values
 * If both values are invalid semver values, then the values are compared alphabetically.
 */
export const compare = memoize((versionA: VersionInput, versionB: VersionInput): number => {
	if (versionA == null) {
		return versionB == null ? 0 : -1;
	}
	if (versionB == null) {
		return 1;
	}

	versionA = normalize(versionA);
	versionB = normalize(versionB);

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
 * @param {string|null|undefined} versionA - The first version to compare
 * @param {string|null|undefined} versionB - The second version to compare
 *
 * @returns {number} Returns `0` if `versionA == versionB`,
 * or `-1` if `versionA` is greater, or `1` if `versionB` is greater.
 * Valid semver values are sorted before invalid semver values, and invalid semver values are
 * sorted before null values.
 * If both values are non-null invalid semver values, then the values are compared alphabetically.
 */
export const rcompare = (versionA: VersionInput, versionB: VersionInput): number => {
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
 * @param {string|null|undefine} version - The version string to evaluate
 *
 * @returns {number|null} - The major version number
 */
export const major = (version: VersionInput): number | null => {
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
 * @param {string|null|undefined} version - The version string to evaluate
 *
 * @returns {Array.<string|number>|null} - An array of prerelease component, or null if none exist
 */
export const prerelease = (version: VersionInput) => {
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
 * @param {string|null|undefined} versionA - The version string to compare against
 * @param {string|null|undefined} versionB - The version string to compare to versionA
 *
 * @returns {boolean} - true if versionA is greater than or equal to versionB, otherwise false.
 */
export const gte = (versionA: VersionInput, versionB: VersionInput): boolean => {
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
 * @param {string|null|undefined} versionA - The version string to compare against
 * @param {string|null|undefined} versionB - The version string to compare to versionA
 *
 *
 * @returns {boolean} - true if versionA is greater than versionB, otherwise false.
 */
export const gt = (versionA: VersionInput, versionB: VersionInput): boolean => {
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
 * @param {string|null|undefined} versionA - The version string to compare against
 * @param {string|null|undefined} versionB - The version string to compare to versionA
 *
 * @returns {boolean} - true if versionA is less than versionB, otherwise false.
 */
export const lt = (versionA: VersionInput, versionB: VersionInput): boolean => {
	return compare(versionA, versionB) < 0;
};

/**
 * @summary Check if a version satisfies a range
 * @name satisfies
 * @public
 * @function
 *
 * @description Return true if the parsed version satisfies the range.
 * This method will always return false if the provided version doesn't contain a valid semver string.
 *
 * @param {string|null|undefined} version - The version to evaluate
 * @param {string} range - A semver range string, see the [node-semver](https://github.com/npm/node-semver#ranges)
 * docs for details
 *
 * @returns {boolean} - True if the parsed version satisfies the range, false otherwise
 *
 */
export const satisfies = (version: VersionInput, range: string) => {
	if (version == null) {
		return false;
	}

	version = normalize(version);

	if (!semver.valid(version)) {
		return false;
	}

	return semver.satisfies(version, range);
};

/**
 * @summary Return the highest version in the list that satisfies the range
 * @name maxSatisfying
 * @public
 * @function
 *
 * @description Return the highest version in the list that satisfies the range, or null if none of them do.
 * If multiple versions are found that have equally high values, the last one in the array is returned.
 * Note that only version that contain a valid semver string can satisfy a range.
 *
 * @param {Array.<string|null|undefined>} versions - An array of versions to evaluate
 * @param {string} range - A semver range string, see the [node-semver](https://github.com/npm/node-semver#ranges)
 * docs for details
 *
 * @returns {string|null} - The highest matching version string, or null.
 *
 */
export const maxSatisfying = (versions: VersionInput[], range: string) => {
	let max: VersionInput = null;

	versions.forEach((version) => {
		if (satisfies(version, range) && gt(version, max)) {
			max = version;
		}
	});

	return max;
};

/*
 * @typedef {Object} SemverObject
 * @property {string} raw - The original version string
 * @property {number} major - The major version number
 * @property {number} minor - The minor version number
 * @property {number} patch - The patch version number
 * @property {Array.<string|number>} prerelease - An array of prerelease values
 * @property {Array.<string|number>} build - An array of build values
 * @property {string} version - The version containing just major, minor, patch
 * and prerelease information
 */

/**
 * @summary Parse a version into an object
 * @name parse
 * @public
 * @function
 *
 * @description Returns an object representing the semver version. Returns null
 * if a valid semver string can't be found.
 *
 * @param {string|null|undefined} version
 *
 * @returns {SemverObject|null} - An object representing the version string, or
 * null if a valid semver string could not be found
 */
export const parse = (version: VersionInput) => {
	if (version == null) {
		return null;
	}
	const parsed = semver.parse(normalize(version));

	if (parsed) {
		parsed.raw = version;
	}

	return parsed;
};

/**
 * @summary Check if a version string is valid
 * @name valid
 * @public
 * @function
 *
 * @description Return the parsed version, or null if it's not valid.
 *
 * @param {string|null|undefined} version
 *
 * @returns {string|null} - The parsed version string, or
 * null if a valid semver string could not be found
 */
export const valid = (version: VersionInput) => {
	if (version == null) {
		return null;
	}
	return semver.valid(normalize(version));
};
