resin-semver
============

> Resin.io specific semver utility methods

[![Build Status](https://travis-ci.org/resin-io-modules/resin-semver.svg?branch=master)](https://travis-ci.org/resin-io-modules/resin-semver)

Role
----

The intention of this module is to provide a collection of resin specific semver utility methods.

**THIS MODULE IS LOW LEVEL AND IS NOT MEANT TO BE USED BY END USERS DIRECTLY**.

Unless you know what you're doing, use the [Resin SDK](https://github.com/resin-io/resin-sdk) instead.

Installation
------------

Install `resin-semver` by running:

```sh
$ npm install --save resin-semver
```

Documentation
-------------

## Functions

<dl>
<dt><a href="#compare">compare(versionA, versionB)</a> ⇒ <code>number</code></dt>
<dd><p>Accepts string or null values and compares them, returning a number
indicating sort order. Values are parsed for valid semver strings.</p>
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
indicating sort order. Values are parsed for valid semver strings.

**Kind**: global function  
**Summary**: Compare order of versions  
**Returns**: <code>number</code> - Returns `0` if `versionA == versionB`,
or `1` if `versionA` is greater, or `-1` if `versionB` is greater. Sorts in ascending
order if passed to `Array.sort()`.
null values are always weighted below string values, and string values are always
weighted below valid semver values.
If both values are invalid semver values, then the values are compared alphabetically.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| versionA | <code>string</code> \| <code>null</code> | The first version to compare |
| versionB | <code>string</code> \| <code>null</code> | The second version to compare |

**Example**  
```js
resinSemver.compare(null, 'Resin OS 2.0.0+rev4 (prod)'); //--> -1

resinSemver.compare('Ubuntu dev', 'Resin OS 2.0.0+rev4 (prod)'); //--> -1

resinSemver.compare('Version A', 'Version B'); //--> 1

resinSemver.compare('Resin OS 1.16.0', 'Resin OS 2.0.0+rev4 (prod)'); //--> 1

resinSemver.compare('Resin OS 2.0.0+rev4 (prod)', 'Resin OS 1.16.0'); //--> -1

resinSemver.compare('Resin OS 1.16.0', 'Resin OS 1.16.0'); //--> 0
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
resinSemver.major(null); //--> null

resinSemver.major('4.5.1'); //--> 4

resinSemver.major('Resin OS v2.0.5'); //--> 2

resinSemver.major('Resin OS v1.24.0'); //--> 1

resinSemver.major('Linux 14.04'); //--> null

resinSemver.major('My development version'); //--> null
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
resinSemver.prerelease('1.16.0-alpha.1'); //--> ['alpha', '1']

resinSemver.prerelease('1.16.0'); //--> null

resinSemver.prerelease('Resin OS 2.0.0-rc5.rev1'); //--> ['rc5', 'rev1']

resinSemver.prerelease('Resin OS 2.0.0'); //--> null

resinSemver.prerelease('My dev version'); //--> null

resinSemver.prerelease('Linux 14.04'); //--> null

resinSemver.prerelease('Software version 42.3.20170726.72bbcf8'); //--> null

resinSemver.prerelease(null)); //--> null
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
resinSemver.gte('2.0.5', '1.16.0'); //--> true

resinSemver.gte('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2'); //--> true

resinSemver.gte('1.16.0', 'Resin OS 2.0.2+rev2'); //--> false
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
resinSemver.gt('2.0.5', '1.16.0'); //--> true

resinSemver.gt('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2'); //--> true

resinSemver.gt('1.16.0', 'Resin OS 2.0.2+rev2'); //--> false

resinSemver.gt('Resin OS 2.0.2', 'Resin OS 2.0.2'); //--> false
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
resinSemver.lt('2.0.5', '1.16.0'); //--> false

resinSemver.lt('Resin OS 2.0.5', 'Resin OS 2.0.2+rev2'); //--> false

resinSemver.lt('1.16.0', 'Resin OS 2.0.2+rev2'); //--> true

resinSemver.lt('Resin OS 2.0.2', 'Resin OS 2.0.2'); //--> false

resinSemver.lt('Version A', 'Version B'); //--> true
```


