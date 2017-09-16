'use strict'

exports.isBrowser = getIsBrowser()
exports.isDebug = getIsDebug()

exports.projectPath = projectPath
exports.onlyCallOnce = onlyCallOnce
exports.countDownCall = countDownCall
exports.fileExists = fileExists
exports.directoryExists = directoryExists
exports.escapeHtml = escapeHtml
exports.rightPad = rightPad
exports.scrollIntoView = scrollIntoView

const fs = require('fs')
const path = require('path')

const ProjectPath = path.dirname(__dirname)

// Return the path of a file relative to the project root if path provided.
// If path not provided, returns the project path itself.
function projectPath (aPath) {
  if (aPath == null) return ProjectPath

  return path.relative(ProjectPath, aPath)
}

// Return a version of a function which will only be called once
function onlyCallOnce (fn) {
  let called = false

  return function onlyCalledOnce () {
    if (called) return
    called = true

    return fn.apply(this, arguments)
  }
}

// Return a version of a function that's only called after `times` number of times
function countDownCall (times, fn) {
  if (times < 1) times = 1

  return function countDownCalled () {
    if (fn == null) return
    if (times <= 0) return

    times--
    if (times !== 0) return

    const result = fn.apply(this, arguments)
    fn = null
    return result
  }
}

// Return boolean indicating if file exists
function fileExists (fileName) {
  const stats = pathExists(fileName)
  if (!stats) return false
  return stats.isFile()
}

// Return boolean indicating if directory exists
function directoryExists (dirName) {
  const stats = pathExists(dirName)
  if (!stats) return false
  return stats.isDirectory()
}

// Return false if path doesn't exist, otherwise it's stat object
function pathExists (pathName) {
  let stats
  try {
    stats = fs.statSync(pathName)
  } catch (err) {
    return false
  }

  return stats
}

// return whether running in browser or not
function getIsBrowser () {
  return (typeof window === 'object') && (typeof window.document === 'object')
}

// return whether running in debug or not
function getIsDebug () {
  const env = exports.isBrowser ? window.localStorage : process.env
  if (env == null) return false
  return (env.DEBUG != null) || (env.LOGLEVEL === 'debug')
}

function escapeHtml (string) {
  if (string == null) return ''
  return string
    .replace('&', '&amp;')
    .replace('<', '&lt;')
    .replace('>', '&gt;')
    .replace('"', '&quot;')
    .replace(`'`, '&#39;')
}

function rightPad (string, len, fill) {
  if (fill == null) fill = ' '
  string = `${string}`
  while (string.length < len) string = `${fill}${string}`
  return string
}

function scrollIntoView (element) {
  if (element == null) return
  if (typeof element.scrollIntoView !== 'function') return

  element.scrollIntoView({behavior: 'smooth'})
}
