import * as semver from 'semver';

// TODO: PR to DefinitelyTyped project
declare module 'semver' {
	// Parse is an undocumented method that returns a semver object
	function parse(version: string, loose?: boolean): semver.SemVer;
}
