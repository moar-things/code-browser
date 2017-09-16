'use strict'

exports.getConfig = getConfig

const DefaultConfig = {
  logLevel: 'info',
  serverAddr: 'localhost',
  serverPort: '3000',
  fileBase: '.'
}

const EnvVarPrefix = 'CODE_BROWSER'

const minimist = require('minimist')

// get config from env vars and cli args
// uses the expected env and args, but can be override for testing

// logLevel:   info | debug
// serverAddr: ip-addr | hostname | *
// serverPort: number
// fileBase:   directory

function getConfig (env, args) {
  if (env == null) env = process.env
  if (args == null) args = process.argv.slice(2)

  const envConfig = getEnvConfig(env)

  const argv = getArgv(args)
  const argConfig = getArgConfig(argv)

  return Object.assign({}, DefaultConfig, envConfig, argConfig)
}

function getEnvConfig (env) {
  if (env == null) env = process.env
  const config = {}

  setFromEnvVar(config, 'logLevel', env, 'LOGLEVEL')
  setFromEnvVar(config, 'logLevel', env, 'LOG_LEVEL')
  setFromEnvVar(config, 'logLevel', env, `${EnvVarPrefix}_LOG_LEVEL`)
  setFromEnvVar(config, 'serverAddr', env, `${EnvVarPrefix}_SERVER_ADDR`)
  setFromEnvVar(config, 'serverPort', env, 'PORT')
  setFromEnvVar(config, 'serverPort', env, `${EnvVarPrefix}_SERVER_PORT`)
  setFromEnvVar(config, 'fileBase', env, `${EnvVarPrefix}_FILE_BASE`)

  return config
}

// parse process.argv, should be same as process.argv.slice(2)
function getArgv (args) {
  const minimistOpts = {
    alias: {
      l: 'log-level',
      a: 'server-addr',
      p: 'server-port',
      f: 'file-base',
      h: 'help',
      v: 'version'
    }
  }

  return minimist(args, minimistOpts)
}

function getArgConfig (argv) {
  const config = {}

  setFromArg(config, 'logLevel', argv, 'log-level')
  setFromArg(config, 'serverAddr', argv, 'server-addr')
  setFromArg(config, 'serverPort', argv, 'server-port')
  setFromArg(config, 'fileBase', argv, 'file-base')
  setFromArg(config, 'help', argv, 'help')
  setFromArg(config, 'version', argv, 'version')

  config.help = !!config.help
  config.version = !!config.version

  return config
}

function setFromEnvVar (object, objectKey, env, envKey) {
  if (env[envKey] == null) return
  object[objectKey] = `${env[envKey]}`
}

function setFromArg (object, objectKey, argv, argvKey) {
  if (argv[argvKey] == null) return
  object[objectKey] = `${argv[argvKey]}`
}
