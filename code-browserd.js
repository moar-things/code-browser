#!/usr/bin/env node

'use strict'

const pkg = require('./package.json')
const help = require('./lib/help')

function main (config) {
  if (config.help) return help.print(__filename)
  if (config.version) return console.log(pkg.version)
}

if (require.main === module) {
  const config = require('./lib/config').getConfig()
  main(config)
}
