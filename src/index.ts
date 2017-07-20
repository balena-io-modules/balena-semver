import * as semver from 'semver';
import memoize = require('lodash.memoize');

// TODO: PR to DefinitelyTyped project
declare module 'semver' {
	function parse(version: string, loose?: boolean): semver.SemVer;
}

const trimOsText = (version: string) => {
	return version.replace(/^resin\sos\s/gi, '')
	.replace(/\(\W\)$/, '');
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

export const compare = memoize((versionA: string, versionB: string) => {
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
