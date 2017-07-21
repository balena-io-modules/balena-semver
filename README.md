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
<dt><a href="#compare">compare(version)</a> ⇒ <code>number</code></dt>
<dd><p>Returns the major version number in a semver string.
If the presented version is a falsey value, it returns <code>0</code>. If the version is
not a valid semver string, it returns the first number it finds in the string.
If there are no numbers in the provided string, it returns <code>1</code>.</p>
</dd>
</dl>

<a name="compare"></a>

## compare(versionA, versionB) ⇒ <code>number</code>
Accepts string or null values and compares them, returning a number
indicating sort order. Values are parsed for valid semver strings.

**Kind**: global function  
**Summary**: Compare order of versions  
**Returns**: <code>number</code> - one of `1`, `0`, or `-1`. null values are always weighted below
string values, and string values are always weighted below valid semver values.
If both values are invalid semver values, then the values are compared alphabetically  
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
<a name="compare"></a>

## compare(version) ⇒ <code>number</code>
Returns the major version number in a semver string.
If the presented version is a falsey value, it returns `0`. If the version is
not a valid semver string, it returns the first number it finds in the string.
If there are no numbers in the provided string, it returns `1`.

**Kind**: global function  
**Summary**: Return the major version number  
**Returns**: <code>number</code> - - The major version number  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> \| <code>null</code> | The version string to evaluate |

**Example**  
```js
resinSemver.major(null); //--> 0

resinSemver.major('Resin OS v2.0.5'); //--> 2

resinSemver.major('Resin OS v2.0.5'); //--> 2

resinSemver.major('Linux 14.04'); //--> 14

resinSemver.major('My development version'); //--> 1
```


