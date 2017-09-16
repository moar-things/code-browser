'use strict'

exports.getLogger = getLogger

const util = require('util')

const chalk = require('chalk')

const utils = require('./utils')
const pkg = require('../package.json')

// Create a new logger.
function getLogger (fileName, opts) {
  fileName = utils.projectPath(fileName)
  return new Logger(fileName, opts)
}

// Create a new logger, to log nice messages to stdXXX.
class Logger {
  constructor (fileName, opts) {
    if (opts == null) opts = {}

    this.opts = opts
    this.fileName = fileName
  }

  // Convert arguments to strings, join with ' ', write as a log message.
  log (messageParms) {
    this._print(arguments)
  }

  // Like log, but only if debug enabled.
  debug (messageParms) {
    // We can actually replace this method with a simpler one when not in debug.
    if (!utils.isDebug) {
      Logger.prototype.debug = () => {}
      return
    }

    this._print(arguments, {debug: true})
  }

  // internal impl that prints the message
  _print (arguments_, opts) {
    opts = opts || {}

    const styledString = new StyledString()
    const messageParms = [].slice.call(arguments_)
    const date = new Date()
    const time = new Date(date.getTime() - (date.getTimezoneOffset() * 1000 * 60))
      .toISOString()
      .substr(11, 12)

    styledString.append(time, 'time')

    if (this.opts.prefixFileName) {
      styledString.append(this.fileName, 'file')
    } else {
      styledString.append(pkg.name, 'pkg')
    }

    if (opts.debug) {
      styledString.append('[DEBUG]', 'debug')
      if (!this.opts.prefixFileName) {
        styledString.append(this.fileName, 'file')
      }
    }

    styledString.append(util.format.apply(util, messageParms))

    console.log.apply(console, styledString.toConsoleLogArgs())
  }
}

class StyledString {
  constructor () {
    this._parts = []
  }

  append (string, style) {
    this._parts.push({string, style})
  }

  toConsoleLogArgs () {
    if (utils.isBrowser) return this.toBrowserConsoleLogArgs()
    return this.toChalkConsoleLogArgs()
  }

  toChalkConsoleLogArgs () {
    const result = []
    for (let part of this._parts) {
      if (part.style == null) {
        result.push(part.string)
        continue
      }

      switch (part.style) {
        case 'time':
          result.push(chalk.yellow(part.string))
          break
        case 'file':
          result.push(chalk.cyan(part.string))
          break
        case 'pkg':
          result.push(chalk.green(part.string))
          break
        case 'debug':
          result.push(chalk.red.dim(part.string))
          break
        default:
          result.push(chalk.red(part.string))
      }
    }

    return [ result.join(' ') ]
  }

  toBrowserConsoleLogArgs () {
    const string = []
    const styles = []

    for (let part of this._parts) {
      string.push(`%c${part.string}`)

      switch (part.style) {
        case 'time':
          styles.push('color: yellow;')
          break
        case 'file':
          styles.push('color: cyan;')
          break
        case 'pkg':
          styles.push('color: green')
          break
        case 'debug':
          styles.push('color: red')
          break
        case null:
          styles.push('color: black')
          break
        default:
          styles.push('background-color: red')
      }
    }

    return [ string.join(' ') ].concat(styles)
  }
}
