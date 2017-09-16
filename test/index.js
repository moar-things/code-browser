'use strict'

const utils = require('./lib/utils')

if (utils.isBrowser) require('./lib/tape-browser.js')

require('./package')
require('./config')
