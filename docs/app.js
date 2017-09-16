(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

const jQuery = window.jQuery

const thisPackage = require('../../package.json')

window.CodeBrowser = {
  version: thisPackage.version
}

console.log('CodeBrowser:', window.CodeBrowser)

jQuery(whenReady)

function whenReady () {
}

},{"../../package.json":2}],2:[function(require,module,exports){
module.exports={
  "name": "code-browser",
  "version": "0.0.1",
  "description": "browse the code",
  "license": "MIT",
  "author": "Patrick Mueller <pmuellr@apache.org> (https://github.com/pmuellr)",
  "homepage": "https://github.com/moar-things/code-browser",
  "repository": {
    "type": "git",
    "url": "https://github.com/moar-things/code-browser.git"
  },
  "bugs": {
    "url": "https://github.com/moar-things/code-browser/issues"
  },
  "scripts": {
    "build": "make build",
    "test": "make test",
    "watch": "make watch"
  },
  "standard": {
    "ignore": [
      "/tmp/",
      "/docs/"
    ]
  },
  "dependencies": {
    "highlight.js": "~9.12.0"
  },
  "devDependencies": {
    "browserify": "~14.4.0",
    "cat-source-map": "~0.1.2",
    "chalk": "~2.1.0",
    "jquery": "~3.2.1",
    "less": "~2.7.2",
    "nodemon": "~1.11.1",
    "standard": "~10.0.3",
    "tap-spec": "~4.1.1",
    "tape": "~4.8.0"
  }
}

},{}]},{},[1])
// sourceMappingURL annotation removed by cat-source-map

//# sourceMappingURL=app.js.map.json