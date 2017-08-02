## Functions

<dl>
<dt><a href="#compare">compare(versionA, versionB)</a> ⇒ <code>number</code></dt>
<dd><p>Accepts string or null values and compares them, returning a number
indicating sort order. Values are parsed for valid semver strings. Sorts an array
of versions in ascending order if passed to <code>Array.sort()</code>.</p>
</dd>
<dt><a href="#rcompare">rcompare(versionA, versionB)</a> ⇒ <code>number</code></dt>
<dd><p>The reverse of <code>.compare()</code>. Accepts string or null values and compares
them, returning a number indicating sort order. Values are parsed for valid semver
strings. Sorts an array of versions in descending order when passed to <code>Array.sort()</code>.</p>
</dd>
<dt><a href="#major">major(version)</a> ⇒ <code>number</code> | <code>null</code></dt>
<dd><p>Returns the major version number in a semver string.
If the version is not a valid semver string, or a valid semver string cannot be
found, it returns null.</p>
</dd>
<dt><a href="#prerelease">prerelease(version)</a> ⇒ <code>Array.&lt;(string|number)&gt;</code> | <code>null</code></dt>
<dd><p>Returns an array of prerelease components, or null if none exist</p>
</dd>
<dt><a href="#gte">gte(versionA, versionB)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if versionA is greater than or equal to versionB.
Valid semver versions are always weighted above non semver strings.
Non-semver strings are compared alphabetically.</p>
</dd>
<dt><a href="#gt">gt(versionA, versionB)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if versionA is greater than versionB.
Valid semver versions are always weighted above non semver strings.
Non-semver strings are compared alphabetically.</p>
</dd>
<dt><a href="#lt">lt(versionA, versionB)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if versionA is less than versionB.
Valid semver versions are always weighted above non semver strings.
Non-semver strings are compared alphabetically.</p>
</dd>
</dl>

<a name="compare"></a>

## compare(versionA, versionB) ⇒ <code>number</code>
Accepts string or null values and compares them, returning a number
indicating sort order. Values are parsed for valid semver strings. Sorts an array
of versions in ascending order if passed to `Array.sort()`.

**Kind**: global function  
**Summary**: Compare order of versions  
**Returns**: <code>number</code> - Returns `0` if `versionA == versionB`,
or `1` if `versionA` is greater, or `-1` if `versionB` is greater.
Null values are sorted before invalid semver values, and invalid semver values
are sorted before valid semver values
If both values are invalid semver values, then the values are compared alphabetically.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| versionA | <code>string</code> \| <code>null</code> | The first version to compare |
| versionB | <code>string</code> \| <code>null</code> | The second version to compare |

**Example**  
```js
it('should not throw when provided with a version', function () {
    versions_1.versions.forEach(function (version) {
        chai_1.expect(function () { return semver.compare(version, version); }).to.not.throw();
    });
});
it('should correctly compare valid semver values', function () {
    chai_1.expect(semver.compare('2.0.5', '1.16.0')).to.equal(1);
    chai_1.expect(semver.compare('2.0.5', '2.0.5')).to.equal(0);
    chai_1.expect(semver.compare('1.16.0', '2.0.5')).to.equal(-1);
});
it('should correctly compare valid semver values to Resin formatted versions', function () {
    chai_1.expect(semver.compare('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(1);
    chai_1.expect(semver.compare('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(-1);
    chai_1.expect(semver.compare('1.16.0', 'Resin OS v1.16.0')).to.equal(0);
    chai_1.expect(semver.compare('Resin OS 1.16.0', '2.0.2')).to.equal(-1);
    chai_1.expect(semver.compare('Resin OS 1.16.0', '1.16.0')).to.equal(0);
    chai_1.expect(semver.compare('Resin OS 2.0.2', '1.16.0')).to.equal(1);
});
it('should correctly compare Resin formatted versions', function () {
    chai_1.expect(semver.compare('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(1);
    chai_1.expect(semver.compare('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(-1);
    chai_1.expect(semver.compare('Resin OS 1.16.0', 'Resin OS 1.16.0')).to.equal(0);
});
it('should correctly compare invalid semver values', function () {
    chai_1.expect(semver.compare('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(-1);
    chai_1.expect(semver.compare('Linux 14.04', 'A development version')).to.equal(1);
    chai_1.expect(semver.compare('Version B', 'Version A')).to.equal(1);
    chai_1.expect(semver.compare('Version A', 'Version A')).to.equal(0);
});
it('should correctly compare null values', function () {
    chai_1.expect(semver.compare('2.0.5', null)).to.equal(1);
    chai_1.expect(semver.compare(null, '1.16.0')).to.equal(-1);
    chai_1.expect(semver.compare('Resin OS 1.16.0', null)).to.equal(1);
    chai_1.expect(semver.compare(null, 'Resin OS 1.16.0')).to.equal(-1);
    chai_1.expect(semver.compare('Linux 14.04', null)).to.equal(1);
    chai_1.expect(semver.compare(null, 'Linux 14.04')).to.equal(-1);
    chai_1.expect(semver.compare(null, null)).to.equal(0);
});
it('should correctly compare "rev" values', function () {
    chai_1.expect(semver.compare('2.0.0+rev6', '2.0.0+rev3')).to.equal(1);
    chai_1.expect(semver.compare('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(1);
    chai_1.expect(semver.compare('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(1);
    chai_1.expect(semver.compare('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(-1);
    chai_1.expect(semver.compare('2.0.0+rev3', '2.0.0+rev3')).to.equal(0);
});
it('should correctly compare ".dev" versions', function () {
    chai_1.expect(semver.compare('2.0.0', '2.0.0+dev')).to.equal(1);
    chai_1.expect(semver.compare('2.0.0', '2.0.0-dev')).to.equal(1);
    chai_1.expect(semver.compare('2.0.0', '2.0.0.dev')).to.equal(1);
    chai_1.expect(semver.compare('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(1);
    chai_1.expect(semver.compare('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(-1);
    chai_1.expect(semver.compare('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(0);
    chai_1.expect(semver.compare('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(1);
    chai_1.expect(semver.compare('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(-1);
    chai_1.expect(semver.compare('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(0);
    chai_1.expect(semver.compare('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(1);
    chai_1.expect(semver.compare('Resin OS 2.0.0.dev', '2.0.0')).to.equal(-1);
    chai_1.expect(semver.compare('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(0);
});
```
<a name="rcompare"></a>

## rcompare(versionA, versionB) ⇒ <code>number</code>
The reverse of `.compare()`. Accepts string or null values and compares
them, returning a number indicating sort order. Values are parsed for valid semver
strings. Sorts an array of versions in descending order when passed to `Array.sort()`.

**Kind**: global function  
**Summary**: Compare order of versions in reverse  
**Returns**: <code>number</code> - Returns `0` if `versionA == versionB`,
or `-1` if `versionA` is greater, or `1` if `versionB` is greater.
Valid semver values are sorted before invalid semver values, and invalid semver values are
sorted before null values.
If both values are non-null invalid semver values, then the values are compared alphabetically.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| versionA | <code>string</code> \| <code>null</code> | The first version to compare |
| versionB | <code>string</code> \| <code>null</code> | The second version to compare |

**Example**  
```js
it('should not throw when provided with a version', function () {
    versions_1.versions.forEach(function (version) {
        chai_1.expect(function () { return semver.rcompare(version, version); }).to.not.throw();
    });
});
it('should correctly compare valid semver values', function () {
    chai_1.expect(semver.rcompare('2.0.5', '1.16.0')).to.equal(-1);
    chai_1.expect(semver.rcompare('2.0.5', '2.0.5')).to.equal(0);
    chai_1.expect(semver.rcompare('1.16.0', '2.0.5')).to.equal(1);
});
it('should correctly compare valid semver values to Resin formatted versions', function () {
    chai_1.expect(semver.rcompare('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(-1);
    chai_1.expect(semver.rcompare('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(1);
    chai_1.expect(semver.rcompare('1.16.0', 'Resin OS v1.16.0')).to.equal(0);
    chai_1.expect(semver.rcompare('Resin OS 1.16.0', '2.0.2')).to.equal(1);
    chai_1.expect(semver.rcompare('Resin OS 1.16.0', '1.16.0')).to.equal(0);
    chai_1.expect(semver.rcompare('Resin OS 2.0.2', '1.16.0')).to.equal(-1);
});
it('should correctly compare Resin formatted versions', function () {
    chai_1.expect(semver.rcompare('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(-1);
    chai_1.expect(semver.rcompare('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(1);
    chai_1.expect(semver.rcompare('Resin OS 1.16.0', 'Resin OS 1.16.0')).to.equal(0);
});
it('should correctly compare invalid semver values', function () {
    chai_1.expect(semver.rcompare('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(1);
    chai_1.expect(semver.rcompare('Linux 14.04', 'A development version')).to.equal(-1);
    chai_1.expect(semver.rcompare('Version B', 'Version A')).to.equal(-1);
    chai_1.expect(semver.rcompare('Version A', 'Version A')).to.equal(0);
});
it('should correctly compare null values', function () {
    chai_1.expect(semver.rcompare('2.0.5', null)).to.equal(-1);
    chai_1.expect(semver.rcompare(null, '1.16.0')).to.equal(1);
    chai_1.expect(semver.rcompare('Resin OS 1.16.0', null)).to.equal(-1);
    chai_1.expect(semver.rcompare(null, 'Resin OS 1.16.0')).to.equal(1);
    chai_1.expect(semver.rcompare('Linux 14.04', null)).to.equal(-1);
    chai_1.expect(semver.rcompare(null, 'Linux 14.04')).to.equal(1);
    chai_1.expect(semver.rcompare(null, null)).to.equal(0);
});
it('should correctly compare "rev" values', function () {
    chai_1.expect(semver.rcompare('2.0.0+rev6', '2.0.0+rev3')).to.equal(-1);
    chai_1.expect(semver.rcompare('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(-1);
    chai_1.expect(semver.rcompare('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(-1);
    chai_1.expect(semver.rcompare('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(1);
    chai_1.expect(semver.rcompare('2.0.0+rev3', '2.0.0+rev3')).to.equal(0);
});
it('should correctly compare ".dev" versions', function () {
    chai_1.expect(semver.rcompare('2.0.0', '2.0.0+dev')).to.equal(-1);
    chai_1.expect(semver.rcompare('2.0.0', '2.0.0-dev')).to.equal(-1);
    chai_1.expect(semver.rcompare('2.0.0', '2.0.0.dev')).to.equal(-1);
    chai_1.expect(semver.rcompare('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(-1);
    chai_1.expect(semver.rcompare('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(1);
    chai_1.expect(semver.rcompare('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(0);
    chai_1.expect(semver.rcompare('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(-1);
    chai_1.expect(semver.rcompare('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(1);
    chai_1.expect(semver.rcompare('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(0);
    chai_1.expect(semver.rcompare('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(-1);
    chai_1.expect(semver.rcompare('Resin OS 2.0.0.dev', '2.0.0')).to.equal(1);
    chai_1.expect(semver.rcompare('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(0);
});
```
<a name="major"></a>

## major(version) ⇒ <code>number</code> \| <code>null</code>
Returns the major version number in a semver string.
If the version is not a valid semver string, or a valid semver string cannot be
found, it returns null.

**Kind**: global function  
**Summary**: Return the major version number  
**Returns**: <code>number</code> \| <code>null</code> - - The major version number  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> \| <code>null</code> | The version string to evaluate |

**Example**  
```js
it('should correctly match valid semver versions', function () {
    chai_1.expect(semver.major('4.5.1')).to.equal(4);
});
it('should correctly match resinOS prefixed versions', function () {
    chai_1.expect(semver.major('Resin OS v2.0.5')).to.equal(2);
    chai_1.expect(semver.major('Resin OS 2.0.2+rev2')).to.equal(2);
    chai_1.expect(semver.major('Resin OS 2.0.0.rev1 (prod)')).to.equal(2);
    chai_1.expect(semver.major('Resin OS 2.0.0-rc5.rev1')).to.equal(2);
});
it('should return null when version is `null`', function () {
    chai_1.expect(semver.major(null)).to.equal(null);
});
it('should return null when the version contains no valid semver value', function () {
    chai_1.expect(semver.major('My dev version')).to.equal(null);
    chai_1.expect(semver.major('Linux 14.04')).to.equal(null);
    chai_1.expect(semver.major('Software version 42.3.20170726.72bbcf8')).to.equal(null);
});
```
<a name="prerelease"></a>

## prerelease(version) ⇒ <code>Array.&lt;(string\|number)&gt;</code> \| <code>null</code>
Returns an array of prerelease components, or null if none exist

**Kind**: global function  
**Summary**: Return prerelease components  
**Returns**: <code>Array.&lt;(string\|number)&gt;</code> \| <code>null</code> - - An array of prerelease component, or null if none exist  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> \| <code>null</code> | The version string to evaluate |

**Example**  
```js
it('should return an array of prerelease components when provided a semver string', function () {
    chai_1.expect(semver.prerelease('1.16.0-alpha.1')).to.eql(['alpha', 1]);
});
it('should return null when provided with a semver string that has no prerelease segment', function () {
    chai_1.expect(semver.prerelease('1.16.0')).to.eql(null);
});
it('should return an array of prerelease components when provided a resinOS prefixed version', function () {
    chai_1.expect(semver.prerelease('Resin OS 2.0.0-rc5.rev1')).to.eql(['rc5', 'rev1']);
});
it('should return null when provided a resinOS prefixed version that has no prerelease segment', function () {
    chai_1.expect(semver.prerelease('Resin OS 2.0.0')).to.equal(null);
});
it('should return null when provided with an invalid version', function () {
    chai_1.expect(semver.prerelease('My dev version')).to.equal(null);
    chai_1.expect(semver.prerelease('Linux 14.04')).to.equal(null);
    chai_1.expect(semver.prerelease('Software version 42.3.20170726.72bbcf8')).to.equal(null);
});
it('should return null when provided with a null value', function () {
    chai_1.expect(semver.prerelease(null)).to.equal(null);
});
```
<a name="gte"></a>

## gte(versionA, versionB) ⇒ <code>boolean</code>
Returns true if versionA is greater than or equal to versionB.
Valid semver versions are always weighted above non semver strings.
Non-semver strings are compared alphabetically.

**Kind**: global function  
**Summary**: Check if a version is greater than or equal to another  
**Returns**: <code>boolean</code> - - true if versionA is greater than or equal to versionB, otherwise false.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| versionA | <code>string</code> \| <code>null</code> | The version string to compare against |
| versionB | <code>string</code> \| <code>null</code> | The version string to compare to versionA |

**Example**  
```js
it('should correctly compare valid semver values', function () {
    chai_1.expect(semver.gte('2.0.5', '1.16.0')).to.equal(true);
    chai_1.expect(semver.gte('1.16.0', '2.0.5')).to.equal(false);
});
it('should correctly compare valid semver values to Resin formatted versions', function () {
    chai_1.expect(semver.gte('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(true);
    chai_1.expect(semver.gte('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(false);
    chai_1.expect(semver.gte('Resin OS 1.16.0', '2.0.2')).to.equal(false);
    chai_1.expect(semver.gte('Resin OS 1.16.0', '1.16.0')).to.equal(true);
});
it('should correctly compare Resin formatted versions', function () {
    chai_1.expect(semver.gte('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(true);
    chai_1.expect(semver.gte('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(false);
});
it('should correctly compare invalid semver values', function () {
    chai_1.expect(semver.gte('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(false);
    chai_1.expect(semver.gte('Linux 14.04', 'A development version')).to.equal(true);
    chai_1.expect(semver.gte('Version B', 'Version A')).to.equal(true);
});
it('should correctly compare null values', function () {
    chai_1.expect(semver.gte('2.0.5', null)).to.equal(true);
    chai_1.expect(semver.gte(null, '1.16.0')).to.equal(false);
    chai_1.expect(semver.gte('Resin OS 1.16.0', null)).to.equal(true);
    chai_1.expect(semver.gte(null, 'Resin OS 1.16.0')).to.equal(false);
    chai_1.expect(semver.gte('Linux 14.04', null)).to.equal(true);
    chai_1.expect(semver.gte(null, 'Linux 14.04')).to.equal(false);
    chai_1.expect(semver.gte(null, null)).to.equal(true);
});
it('should correctly compare "rev" values', function () {
    chai_1.expect(semver.gte('2.0.0+rev6', '2.0.0+rev3')).to.equal(true);
    chai_1.expect(semver.gte('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(true);
    chai_1.expect(semver.gte('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(true);
    chai_1.expect(semver.gte('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(false);
    chai_1.expect(semver.gte('2.0.0+rev3', '2.0.0+rev3')).to.equal(true);
});
it('should correctly compare ".dev" versions', function () {
    chai_1.expect(semver.gte('2.0.0', '2.0.0+dev')).to.equal(true);
    chai_1.expect(semver.gte('2.0.0', '2.0.0-dev')).to.equal(true);
    chai_1.expect(semver.gte('2.0.0', '2.0.0.dev')).to.equal(true);
    chai_1.expect(semver.gte('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(true);
    chai_1.expect(semver.gte('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(false);
    chai_1.expect(semver.gte('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(true);
    chai_1.expect(semver.gte('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(true);
    chai_1.expect(semver.gte('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(false);
    chai_1.expect(semver.gte('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(true);
    chai_1.expect(semver.gte('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(true);
    chai_1.expect(semver.gte('Resin OS 2.0.0.dev', '2.0.0')).to.equal(false);
    chai_1.expect(semver.gte('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(true);
});
```
<a name="gt"></a>

## gt(versionA, versionB) ⇒ <code>boolean</code>
Returns true if versionA is greater than versionB.
Valid semver versions are always weighted above non semver strings.
Non-semver strings are compared alphabetically.

**Kind**: global function  
**Summary**: Check if a version is greater than another  
**Returns**: <code>boolean</code> - - true if versionA is greater than versionB, otherwise false.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| versionA | <code>string</code> \| <code>null</code> | The version string to compare against |
| versionB | <code>string</code> \| <code>null</code> | The version string to compare to versionA |

**Example**  
```js
it('should correctly compare valid semver values', function () {
    chai_1.expect(semver.gt('2.0.5', '1.16.0')).to.equal(true);
    chai_1.expect(semver.gt('1.16.0', '2.0.5')).to.equal(false);
    chai_1.expect(semver.gt('1.16.0', '1.16.0')).to.equal(false);
});
it('should correctly compare valid semver values to Resin formatted versions', function () {
    chai_1.expect(semver.gt('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(true);
    chai_1.expect(semver.gt('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(false);
    chai_1.expect(semver.gt('Resin OS 1.16.0', '2.0.2')).to.equal(false);
    chai_1.expect(semver.gt('Resin OS 1.16.0', '1.16.0')).to.equal(false);
});
it('should correctly compare Resin formatted versions', function () {
    chai_1.expect(semver.gt('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(true);
    chai_1.expect(semver.gt('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(false);
    chai_1.expect(semver.gt('Resin OS 1.16.0', 'Resin OS 1.16.0')).to.equal(false);
});
it('should correctly compare invalid semver values', function () {
    chai_1.expect(semver.gt('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(false);
    chai_1.expect(semver.gt('Linux 14.04', 'A development version')).to.equal(true);
    chai_1.expect(semver.gt('Version B', 'Version A')).to.equal(true);
    chai_1.expect(semver.gt('Version A', 'Version A')).to.equal(false);
});
it('should correctly compare null values', function () {
    chai_1.expect(semver.gt('2.0.5', null)).to.equal(true);
    chai_1.expect(semver.gt(null, '1.16.0')).to.equal(false);
    chai_1.expect(semver.gt('Resin OS 1.16.0', null)).to.equal(true);
    chai_1.expect(semver.gt(null, 'Resin OS 1.16.0')).to.equal(false);
    chai_1.expect(semver.gt('Linux 14.04', null)).to.equal(true);
    chai_1.expect(semver.gt(null, 'Linux 14.04')).to.equal(false);
    chai_1.expect(semver.gt(null, null)).to.equal(false);
});
it('should correctly compare "rev" values', function () {
    chai_1.expect(semver.gt('2.0.0+rev6', '2.0.0+rev3')).to.equal(true);
    chai_1.expect(semver.gt('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(true);
    chai_1.expect(semver.gt('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(true);
    chai_1.expect(semver.gt('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(false);
    chai_1.expect(semver.gt('2.0.0+rev3', '2.0.0+rev3')).to.equal(false);
});
it('should correctly compare ".dev" versions', function () {
    chai_1.expect(semver.gt('2.0.0', '2.0.0+dev')).to.equal(true);
    chai_1.expect(semver.gt('2.0.0', '2.0.0-dev')).to.equal(true);
    chai_1.expect(semver.gt('2.0.0', '2.0.0.dev')).to.equal(true);
    chai_1.expect(semver.gt('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(true);
    chai_1.expect(semver.gt('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(false);
    chai_1.expect(semver.gt('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(false);
    chai_1.expect(semver.gt('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(true);
    chai_1.expect(semver.gt('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(false);
    chai_1.expect(semver.gt('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(false);
    chai_1.expect(semver.gt('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(true);
    chai_1.expect(semver.gt('Resin OS 2.0.0.dev', '2.0.0')).to.equal(false);
    chai_1.expect(semver.gt('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(false);
});
```
<a name="lt"></a>

## lt(versionA, versionB) ⇒ <code>boolean</code>
Returns true if versionA is less than versionB.
Valid semver versions are always weighted above non semver strings.
Non-semver strings are compared alphabetically.

**Kind**: global function  
**Summary**: Check if a version is less than another  
**Returns**: <code>boolean</code> - - true if versionA is less than versionB, otherwise false.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| versionA | <code>string</code> \| <code>null</code> | The version string to compare against |
| versionB | <code>string</code> \| <code>null</code> | The version string to compare to versionA |

**Example**  
```js
it('should correctly compare valid semver values', function () {
    chai_1.expect(semver.lt('2.0.5', '1.16.0')).to.equal(false);
    chai_1.expect(semver.lt('1.16.0', '2.0.5')).to.equal(true);
    chai_1.expect(semver.lt('1.16.0', '1.16.0')).to.equal(false);
});
it('should correctly compare valid semver values to Resin formatted versions', function () {
    chai_1.expect(semver.lt('2.0.5', 'Resin OS v2.0.2+rev2')).to.equal(false);
    chai_1.expect(semver.lt('1.16.0', 'Resin OS v2.0.2+rev2')).to.equal(true);
    chai_1.expect(semver.lt('Resin OS 1.16.0', '2.0.2')).to.equal(true);
    chai_1.expect(semver.lt('Resin OS 1.16.0', '1.16.0')).to.equal(false);
});
it('should correctly compare Resin formatted versions', function () {
    chai_1.expect(semver.lt('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2')).to.equal(false);
    chai_1.expect(semver.lt('Resin OS 1.16.0', 'Resin OS 2.0.2 (prod)')).to.equal(true);
    chai_1.expect(semver.lt('Resin OS 1.16.0', 'Resin OS 1.16.0')).to.equal(false);
});
it('should correctly compare invalid semver values', function () {
    chai_1.expect(semver.lt('Linux 14.04', 'Resin OS v2.0.2+rev2')).to.equal(true);
    chai_1.expect(semver.lt('Linux 14.04', 'A development version')).to.equal(false);
    chai_1.expect(semver.lt('Version B', 'Version A')).to.equal(false);
    chai_1.expect(semver.lt('Version A', 'Version A')).to.equal(false);
});
it('should correctly compare null values', function () {
    chai_1.expect(semver.lt('2.0.5', null)).to.equal(false);
    chai_1.expect(semver.lt(null, '1.16.0')).to.equal(true);
    chai_1.expect(semver.lt('Resin OS 1.16.0', null)).to.equal(false);
    chai_1.expect(semver.lt(null, 'Resin OS 1.16.0')).to.equal(true);
    chai_1.expect(semver.lt('Linux 14.04', null)).to.equal(false);
    chai_1.expect(semver.lt(null, 'Linux 14.04')).to.equal(true);
    chai_1.expect(semver.lt(null, null)).to.equal(false);
});
it('should correctly compare "rev" values', function () {
    chai_1.expect(semver.lt('2.0.0+rev6', '2.0.0+rev3')).to.equal(false);
    chai_1.expect(semver.lt('Resin OS 2.0.0+rev4', 'Resin OS 2.0.0+rev3')).to.equal(false);
    chai_1.expect(semver.lt('2.0.0+rev6', 'Resin OS 2.0.0+rev3')).to.equal(false);
    chai_1.expect(semver.lt('2.0.0+rev2', 'Resin OS 2.0.0+rev5')).to.equal(true);
    chai_1.expect(semver.lt('2.0.0+rev3', '2.0.0+rev3')).to.equal(false);
});
it('should correctly compare ".dev" versions', function () {
    chai_1.expect(semver.lt('2.0.0', '2.0.0+dev')).to.equal(false);
    chai_1.expect(semver.lt('2.0.0', '2.0.0-dev')).to.equal(false);
    chai_1.expect(semver.lt('2.0.0', '2.0.0.dev')).to.equal(false);
    chai_1.expect(semver.lt('2.0.0+rev6', '2.0.0+rev6.dev')).to.equal(false);
    chai_1.expect(semver.lt('2.0.0+rev6.dev', '2.0.0+rev6')).to.equal(true);
    chai_1.expect(semver.lt('2.0.0+rev6.dev', '2.0.0+rev6.dev')).to.equal(false);
    chai_1.expect(semver.lt('Resin OS 2.0.0+rev3', 'Resin OS 2.0.0+rev3.dev')).to.equal(false);
    chai_1.expect(semver.lt('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3')).to.equal(true);
    chai_1.expect(semver.lt('Resin OS 2.0.0+rev3.dev', 'Resin OS 2.0.0+rev3.dev')).to.equal(false);
    chai_1.expect(semver.lt('2.0.0', 'Resin OS 2.0.0.dev')).to.equal(false);
    chai_1.expect(semver.lt('Resin OS 2.0.0.dev', '2.0.0')).to.equal(true);
    chai_1.expect(semver.lt('Resin OS 2.0.0.dev', '2.0.0.dev')).to.equal(false);
});
```
