'use strict'

exports.print = print

const fs = require('fs')

const pkg = require('../package.json')

function print (helpFile) {
  const fileName = `${helpFile}.md`
  const program = pkg.name
  const version = pkg.version
  const homepage = pkg.homepage
  const description = pkg.description

  const help = fs.readFileSync(fileName, 'utf8')
    .replace(/%program%/g, program)
    .replace(/%version%/g, version)
    .replace(/%homepage%/g, homepage)
    .replace(/%description%/g, description)

  console.log(help)
}
