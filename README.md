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

<a name="compare"></a>

## compare(versionA, versionB) ⇒ <code>number</code>
Accepts string or null values and compares them, returning a numnber indicating sort order.
Values are parsed for valid semver strings.

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
resinSemver.compare(null, 'Resin OS 2.0.0+rev4 (prod)'); // -1

resinSemver.compare('Ubuntu dev', 'Resin OS 2.0.0+rev4 (prod)'); // -1

resinSemver.compare('Version A', 'Version B'); // 1

resinSemver.compare('Resin OS 1.16.0', 'Resin OS 2.0.0+rev4 (prod)'); // 1

resinSemver.compare('Resin OS 2.0.0+rev4 (prod)', 'Resin OS 1.16.0'); // -1

resinSemver.compare('Resin OS 1.16.0', 'Resin OS 1.16.0'); // 0
```


