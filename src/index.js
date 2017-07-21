"use strict";
exports.__esModule = true;
var semver = require("semver");
var memoize = require("lodash.memoize");
var trimOsText = function (version) {
    return version.replace(/^resin\sos\s/gi, '')
        .replace(/\(\W\)$/, '');
};
var safeSemver = function (version) {
    return version.replace(/(\.[0-9]+)\.rev/, '$1+rev');
};
var getRev = function (osVersion) {
    var rev = semver.parse(osVersion).build.map(function (metadataPart) {
        var matches = /rev(\d+)/.exec(metadataPart);
        return matches && matches[0] || null;
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
 * @description Accepts string or null values and compares them, returning a numnber indicating sort order.
 * Values are parsed for valid semver strings.
 *
 * @param {string|null} versionA - The first version to compare
 * @param {string|null} versionB - The second version to compare
 *
 * @returns {number} one of `1`, `0`, or `-1`. null values are always weighted below
 * string values, and string values are always weighted below valid semver values.
 * If both values are invalid semver values, then the values are compared alphabetically
 *
 * @example
 * resinSemver.compare(null, 'Resin OS 2.0.0+rev4 (prod)'); // -1
 *
 * resinSemver.compare('Ubuntu dev', 'Resin OS 2.0.0+rev4 (prod)'); // -1
 *
 * resinSemver.compare('Version A', 'Version B'); // 1
 *
 * resinSemver.compare('Resin OS 1.16.0', 'Resin OS 2.0.0+rev4 (prod)'); // 1
 *
 * resinSemver.compare('Resin OS 2.0.0+rev4 (prod)', 'Resin OS 1.16.0'); // -1
 *
 * resinSemver.compare('Resin OS 1.16.0', 'Resin OS 1.16.0'); // 0
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
    versionA = versionA;
    versionB = versionB;
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
            return -1;
        }
        if (versionA < versionB) {
            return 1;
        }
        return 0;
    }
    versionA = trimOsText(safeSemver(versionA));
    versionB = trimOsText(safeSemver(versionB));
    var semverResult = semver.rcompare(versionA, versionB);
    if (semverResult !== 0) {
        return semverResult;
    }
    var revA = getRev(versionA);
    var revB = getRev(versionB);
    if (revA !== revB) {
        return revB - revA;
    }
    var devA = Number(isDevelopmentVersion(versionA));
    var devB = Number(isDevelopmentVersion(versionB));
    if (devA !== devB) {
        return devA - devB;
    }
    return versionA.localeCompare(versionB);
}, function (a, b) { return a + " && " + b; });
