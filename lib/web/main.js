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
