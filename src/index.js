"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memoize = require("lodash.memoize");
var semver = require("semver");
var trimOsText = function (version) {
    // Remove "Resin OS" and "Balena OS" text
    return (version
        .replace(/(resin|balena)\s*os\s*/gi, '')
        // Remove optional versioning, eg "(prod)", "(dev)"
        .replace(/\s+\(\w+\)$/, '')
        // Remove "v" prefix
        .replace(/^v/, ''));
};
var safeSemver = function (version) {
    // fix major.minor.patch.rev to use rev as build metadata
    return (version
        .replace(/(\.[0-9]+)\.rev/, '$1+rev')
        // fix major.minor.patch.prod to be treat .dev & .prod as build metadata
        .replace(/([0-9]+\.[0-9]+\.[0-9]+)\.(dev|prod)\b/i, '$1+$2')
        // if there are no build metadata, then treat the parenthesized value as one
        .replace(/([0-9]+\.[0-9]+\.[0-9]+(?:[-\.][0-9a-z]+)*) \(([0-9a-z]+)\)/i, '$1+$2')
        // if there are build metadata, then treat the parenthesized value as point value
        .replace(/([0-9]+\.[0-9]+\.[0-9]+(?:[-\+\.][0-9a-z]+)*) \(([0-9a-z]+)\)/i, '$1.$2'));
};
var normalize = function (version) { return trimOsText(safeSemver(version)); };
var getRev = function (parsedVersion) {
    if (parsedVersion === null) {
        return 0;
    }
    var rev = parsedVersion.build
        .map(function (metadataPart) {
        var matches = /rev(\d+)/.exec(metadataPart);
        return (matches && matches[1]) || null;
    })
        .filter(function (x) { return x != null; })[0];
    if (rev != null) {
        return parseInt(rev, 10);
    }
    else {
        return 0;
    }
};
var isDevelopmentVersion = function (parsedVersion) {
    if (parsedVersion === null) {
        return false;
    }
    return parsedVersion.build.indexOf('dev') >= 0;
};
var compareValues = function (valueA, valueB) {
    if (valueA > valueB) {
        return 1;
    }
    if (valueA < valueB) {
        return -1;
    }
    return 0;
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
exports.compare = memoize(function (versionA, versionB) {
    if (versionA == null) {
        return versionB == null ? 0 : -1;
    }
    if (versionB == null) {
        return 1;
    }
    versionA = normalize(versionA);
    versionB = normalize(versionB);
    var semverA = semver.parse(versionA);
    var semverB = semver.parse(versionB);
    if (!semverA || !semverB) {
        if (semverA) {
            // !semverB
            return 1;
        }
        if (semverB) {
            // !semverA
            return -1;
        }
        return compareValues(versionA, versionB);
    }
    var semverResult = semver.compare(semverA, semverB);
    if (semverResult !== 0) {
        return semverResult;
    }
    var revResult = compareValues(getRev(semverA), getRev(semverB));
    if (revResult !== 0) {
        return revResult;
    }
    var devResult = compareValues(isDevelopmentVersion(semverA), isDevelopmentVersion(semverB));
    if (devResult !== 0) {
        return devResult * -1;
    }
    return versionA.localeCompare(versionB);
}, function (a, b) { return a + " && " + b; });
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
exports.rcompare = function (versionA, versionB) {
    return 0 - exports.compare(versionA, versionB);
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
exports.major = function (version) {
    if (!version) {
        return null;
    }
    version = normalize(version);
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
exports.prerelease = function (version) {
    if (!version) {
        return null;
    }
    version = normalize(version);
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
exports.gte = function (versionA, versionB) {
    return exports.compare(versionA, versionB) >= 0;
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
exports.gt = function (versionA, versionB) {
    return exports.compare(versionA, versionB) > 0;
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
exports.lt = function (versionA, versionB) {
    return exports.compare(versionA, versionB) < 0;
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
exports.satisfies = function (version, range) {
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
exports.maxSatisfying = function (versions, range) {
    var max = null;
    var normalizedRange = normalize(range);
    versions.forEach(function (version) {
        if (exports.satisfies(version, normalizedRange) && exports.gt(version, max)) {
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
exports.parse = function (version) {
    if (version == null) {
        return null;
    }
    var parsed = semver.parse(normalize(version));
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
exports.valid = function (version) {
    if (version == null) {
        return null;
    }
    return semver.valid(normalize(version));
};
/**
 * @summary Return an incremented version
 * @name inc
 * @public
 * @function
 *
 * @description Return the version incremented by the release type
 * (major, premajor, minor, preminor, patch, prepatch, or prerelease), or null
 * if it's not valid.
 *
 * @param {string|null|undefined} version
 * @param {string} release
 *
 * @returns {string|null} - The incremented version string, or
 * null if a valid semver string could not be found
 */
exports.inc = function (version, release) {
    if (version == null) {
        return null;
    }
    return semver.inc(normalize(version), release);
};
