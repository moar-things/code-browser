'use strict'

exports.createTestRunner = createTestRunner

const libUtils = require('../../lib/utils')
for (let name in libUtils) {
  exports[name] = libUtils[name]
}

const tape = require('tape')

// Create a test runner given the source file name of the test.
// Returns a function which takes a test function, which takes a standard `t`
// tape object as a parameter.
function createTestRunner (sourceFile) {
  sourceFile = libUtils.projectPath(sourceFile)

  return function testRunner (testFunction) {
    const testName = `${sourceFile} - ${testFunction.name}()`

    tape(testName, function (t) { testFunction(t) })
  }
}
