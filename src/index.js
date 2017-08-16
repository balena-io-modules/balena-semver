"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoize = require("lodash.memoize");
const semver = require("semver");
const trimOsText = (version) => {
    return version.replace(/^resin\sos\s+/gi, '')
        .replace(/\s+\(\w+\)$/, '')
        .replace(/^v/, '');
};
const safeSemver = (version) => {
    return version.replace(/(\.[0-9]+)\.rev/, '$1+rev');
};
const normalize = (version) => trimOsText(safeSemver(version));
const getRev = (osVersion) => {
    const parsedVersion = semver.parse(osVersion);
    if (parsedVersion === null) {
        return 0;
    }
    const rev = parsedVersion.build.map(function (metadataPart) {
        const matches = /rev(\d+)/.exec(metadataPart);
        return matches && matches[1] || null;
    })
        .filter((x) => x != null)[0];
    if (rev != null) {
        return parseInt(rev, 10);
    }
    else {
        return 0;
    }
};
const isDevelopmentVersion = (version) => {
    return /(\.|\+|-)dev/.test(version);
};
exports.compare = memoize((versionA, versionB) => {
    if (versionA === null) {
        return versionB === null ? 0 : -1;
    }
    if (versionB === null) {
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
}, (a, b) => `${a} && ${b}`);
exports.rcompare = (versionA, versionB) => {
    return 0 - exports.compare(versionA, versionB);
};
exports.major = (version) => {
    if (!version) {
        return null;
    }
    version = trimOsText(safeSemver(version));
    if (semver.valid(version)) {
        return semver.major(version);
    }
    return null;
};
exports.prerelease = (version) => {
    if (!version) {
        return null;
    }
    version = trimOsText(safeSemver(version));
    return semver.prerelease(version);
};
exports.gte = (versionA, versionB) => {
    return exports.compare(versionA, versionB) >= 0;
};
exports.gt = (versionA, versionB) => {
    return exports.compare(versionA, versionB) > 0;
};
exports.lt = (versionA, versionB) => {
    return exports.compare(versionA, versionB) < 0;
};
exports.satisfies = (version, range) => {
    if (version === null) {
        return false;
    }
    version = normalize(version);
    if (!semver.valid(version)) {
        return false;
    }
    return semver.satisfies(version, range);
};
exports.maxSatisfying = (versions, range) => {
    let max = null;
    versions.forEach((version) => {
        if (exports.satisfies(version, range) && exports.gt(version, max)) {
            max = version;
        }
    });
    return max;
};
exports.parse = (version) => {
    if (version === null) {
        return null;
    }
    const parsed = semver.parse(normalize(version));
    if (parsed) {
        parsed.raw = version;
    }
    return parsed;
};
//# sourceMappingURL=index.js.map