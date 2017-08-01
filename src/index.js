"use strict";
exports.__esModule = true;
var semver = require("semver");
var memoize = require("lodash.memoize");
var trimOsText = function (version) {
    // Remove "Resin OS" text
    return version.replace(/^resin\sos\s+/gi, '')
        .replace(/\s+\(\w+\)$/, '')
        .replace(/^v/, '');
};
var safeSemver = function (version) {
    return version.replace(/(\.[0-9]+)\.rev/, '$1+rev');
};
var normalize = function (version) { return trimOsText(safeSemver(version)); };
var getRev = function (osVersion) {
    var rev = semver.parse(osVersion).build.map(function (metadataPart) {
        var matches = /rev(\d+)/.exec(metadataPart);
        return matches && matches[1] || null;
    })
        .filter(function (x) { return x != null; })[0];
    if (rev != null) {
        return parseInt(rev, 10);
    }
    else {
        return 0;
    }
};
var isDevelopmentVersion = function (version) {
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
 * @returns {number} Returns `0` if `versionA == versionB`,
 * or `1` if `versionA` is greater, or `-1` if `versionB` is greater. Sorts in ascending
 * order if passed to `Array.sort()`.
 * null values are always weighted below string values, and string values are always
 * weighted below valid semver values.
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
exports.compare = memoize(function (versionA, versionB) {
    if (versionA === null && versionB === null) {
        return 0;
    }
    if (versionA === null && versionB !== null) {
        return -1;
    }
    if (versionA !== null && versionB === null) {
        return 1;
    }
    versionA = normalize(versionA);
    versionB = normalize(versionB);
    var isAValid = semver.valid(versionA);
    var isBValid = semver.valid(versionB);
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
    var semverResult = semver.compare(versionA, versionB);
    if (semverResult !== 0) {
        return semverResult;
    }
    var revA = getRev(versionA);
    var revB = getRev(versionB);
    if (revA !== revB) {
        return revA > revB ? 1 : -1;
    }
    var devA = Number(isDevelopmentVersion(versionA));
    var devB = Number(isDevelopmentVersion(versionB));
    if (devA !== devB) {
        return devA > devB ? -1 : 1;
    }
    return versionA.localeCompare(versionB);
}, function (a, b) { return a + " && " + b; });
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
exports.major = function (version) {
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
exports.prerelease = function (version) {
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
 * @param {string|null} versionA - The version string to compare against
 * @param {string|null} versionB - The version string to compare to versionA
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
exports.gt = function (versionA, versionB) {
    return exports.compare(versionA, versionB) > 0;
};
