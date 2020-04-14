# A Node.js collection model for mongoose stuff

[![Build Status](https://travis-ci.org/5orenso/preact-util.svg?branch=master)](https://travis-ci.org/5orenso/preact-util)
[![Coverage Status](https://coveralls.io/repos/github/5orenso/preact-util/badge.svg?branch=master)](https://coveralls.io/github/5orenso/preact-util?branch=master)
[![GitHub version](https://badge.fury.io/gh/5orenso%2Fpreact-util.svg)](https://badge.fury.io/gh/5orenso%2Fpreact-util)
[![npm version](https://badge.fury.io/js/preact-util.svg)](https://badge.fury.io/js/preact-util)

## TL;DR

### Installation

```bash
npm install preact-util --save
```

### Usage

It's easy. Import and use the utilities.

```javascript
import util from 'preact-util';

const apiServer = props.apiServer || `${window.location.protocol}//${window.location.host}`;
util.setApiServer(apiServer);
```

### List of some useful functions

- isNumber
- checkNested
- setNestedValue
- asNumber
- asString
- asObject
- asBoolean
- cleanObject
- padDate
- parseInputDate
- isoDate
- getApiServer
- setApiServer
- getImageServer
- setImageServer
- getJwtToken
- setJwtToken
- removeJwtToken
- setUserEmail
- getUserEmail
- removeUserEmail
- setObject
- unsetObj
- getObject
- set
- unset
- get
- fetchApi
- format
- formatCompact
- formatBytes
- getDomain
- getImageHostname
- getImageSrc
- isCapsLock
- validateEmail
- ucfirst
- randomPassword
- toggleDarkModeClasses

I promise to add some more documentation, or if you want to help, please follow the instructions below.

## Helper modules in use:

__Jest__ A browser JavaScript testing toolkit. Jest is used by Facebook to test all JavaScript code including React applications. One of Jest's philosophies is to provide an integrated "zero-configuration" experience.

__ESLint__ ESLint is a code style linter for programmatically enforcing your style guide.

__Travis__
Travis CI is a hosted continuous integration service. It is integrated with GitHub and offers first class support for many languages.

__Coveralls.io__
Coveralls is a web service to help you track your code coverage over time, and ensure that all your new code is fully covered.

__Retire__
Scanner detecting the use of JavaScript libraries with known vulnerabilities.


### Howto to get started with contributions

```bash
$ git clone git@github.com:5orenso/preact-util.git
$ cd preact-util/
$ npm install
```

Start developing. Remember to start watching your files:
```bash
$ npm run test:watch
```


### HOWTO fix eslint issues
```bash
$ eslint --fix lib/utilities.js
```


### Howto contribute

```bash
$ git clone git@github.com:5orenso/preact-util.git
```
Do your magic and create a pull request.


### Howto report issues
Use the [Issue tracker](https://github.com/5orenso/preact-util/issues)


### Howto update CHANGELOG.md
```bash
$ bash ./changelog.sh
```


### Howto update NPM module

1. Bump version inside `package.json`
2. Push all changes to Github.
3. Push all changes to npmjs.com: `$ bash ./npm-release.sh`.


### Howto check for vulnerabilities in modules
```bash
# Install Node Security Platform CLI
$ npm install nsp --global  

# From inside your project directory
$ nsp check  
```


### Howto upgrade modules
```bash
$ sudo npm install -g npm-check-updates
$ ncu -u -a
$ npm install --no-optional
```


### Versioning
For transparency and insight into the release cycle, releases will be
numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on semantic versioning, please visit http://semver.org/.


## Contributions and feedback:

We ❤️ contributions and feedback.

If you want to contribute, please check out the [CONTRIBUTING.md](CONTRIBUTING.md) file.

If you have any question or suggestion create an issue.

Bug reports should always be done with a new issue.


## Other Resources

* [Node.js utilities](https://github.com/5orenso/node-simple-utilities)
* [Node.js Preact utilities](https://github.com/5orenso/preact-util)
* [Node.js Preact Mobx storemodel](https://github.com/5orenso/preact-util)
* [Node.js boilerplate for Express](https://github.com/5orenso/node-express-boilerplate)
* [Node.js boilerplate for modules](https://github.com/5orenso/node-simple-boilerplate)
* [Node.js boilerplate for Preact](https://github.com/5orenso/preact-boilerplate)


## More about the author

- Twitter: [@sorenso](https://twitter.com/sorenso)
- Instagram: [@sorenso](https://instagram.com/sorenso)
- Facebook: [@sorenso](https://facebook.com/sorenso)
