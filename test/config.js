'use strict'

const utils = require('./lib/utils')
const runTest = utils.createTestRunner(__filename)

const configurator = require('../lib/config')

runTest(function testDefault (t) {
  const config = configurator.getConfig({}, [])

  tEquals(t, config.logLevel, 'info', 'logLevel')
  tEquals(t, config.serverAddr, 'localhost', 'serverAddr')
  tEquals(t, config.serverPort, '3000', 'serverPort')
  tEquals(t, config.fileBase, '.', 'fileBase')
  tEquals(t, config.help, false, 'help')
  tEquals(t, config.version, false, 'version')

  t.end()
})

// test env vars
runTest(function testEnv (t) {
  const env = {
    CODE_BROWSER_LOG_LEVEL: '1',
    CODE_BROWSER_SERVER_ADDR: '2',
    CODE_BROWSER_SERVER_PORT: '3',
    CODE_BROWSER_FILE_BASE: '4'
  }
  const config = configurator.getConfig(env, [])

  tEquals(t, config.logLevel, '1', 'logLevel')
  tEquals(t, config.serverAddr, '2', 'serverAddr')
  tEquals(t, config.serverPort, '3', 'serverPort')
  tEquals(t, config.fileBase, '4', 'fileBase')

  t.end()
})

// test variations of loglevel
runTest(function testEnvLogLevel (t) {
  let env, config

  env = {
    LOGLEVEL: '1',
    LOG_LEVEL: '2',
    CODE_BROWSER_LOG_LEVEL: '3'
  }
  config = configurator.getConfig(env, [])

  tEquals(t, config.logLevel, '3', 'logLevel')

  env = {
    LOGLEVEL: '1',
    LOG_LEVEL: '2'
  }
  config = configurator.getConfig(env, [])

  tEquals(t, config.logLevel, '2', 'logLevel')

  env = {
    LOGLEVEL: '1'
  }
  config = configurator.getConfig(env, [])

  tEquals(t, config.logLevel, '1', 'logLevel')

  t.end()
})

// test variations of port
runTest(function testEnvPort (t) {
  let env, config

  env = {
    PORT: '1',
    CODE_BROWSER_SERVER_PORT: '2'
  }
  config = configurator.getConfig(env, [])

  tEquals(t, config.serverPort, '2', 'port')

  env = {
    PORT: '1'
  }
  config = configurator.getConfig(env, [])

  tEquals(t, config.serverPort, '1', 'port')

  t.end()
})

// test default args
runTest(function testArgsLong (t) {
  const config = configurator.getConfig({}, [
    '--log-level', '1',
    '--server-addr', '2',
    '--server-port', '3',
    '--file-base', '4',
    '--help',
    '--version'
  ])

  tEquals(t, config.logLevel, '1', 'logLevel')
  tEquals(t, config.serverAddr, '2', 'serverAddr')
  tEquals(t, config.serverPort, '3', 'serverPort')
  tEquals(t, config.fileBase, '4', 'fileBase')
  tEquals(t, config.help, true, 'help')
  tEquals(t, config.version, true, 'version')

  t.end()
})

// test short args
runTest(function testArgsShort (t) {
  const config = configurator.getConfig({}, [
    '-l', '1',
    '-a', '2',
    '-p', '3',
    '-f', '4',
    '-h',
    '-v'
  ])

  tEquals(t, config.logLevel, '1', 'logLevel')
  tEquals(t, config.serverAddr, '2', 'serverAddr')
  tEquals(t, config.serverPort, '3', 'serverPort')
  tEquals(t, config.fileBase, '4', 'fileBase')
  tEquals(t, config.help, true, 'help')
  tEquals(t, config.version, true, 'version')

  t.end()
})

// test cli args and env
runTest(function testArgsEnv (t) {
  const args = [
    '--log-level', '1',
    '--server-addr', '2',
    '--server-port', '3',
    '--file-base', '4'
  ]

  const env = {
    CODE_BROWSER_LOG_LEVEL: '5',
    CODE_BROWSER_SERVER_ADDR: '6',
    CODE_BROWSER_SERVER_PORT: '7',
    CODE_BROWSER_FILE_BASE: '8'
  }

  const config = configurator.getConfig(env, args)

  tEquals(t, config.logLevel, '1', 'logLevel')
  tEquals(t, config.serverAddr, '2', 'serverAddr')
  tEquals(t, config.serverPort, '3', 'serverPort')
  tEquals(t, config.fileBase, '4', 'fileBase')

  t.end()
})

function tEquals (t, actual, expected, name) {
  t.equals(actual, expected, `${name} should be equal: actual: ${actual} expected: ${expected}`)
}
