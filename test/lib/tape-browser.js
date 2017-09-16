'use strict'

// display tape results in an HTML page

// there are no exports, this module performs some setup before tests are
// run elsewhere.

const tape = require('tape')

// some basic styling
const StyleFail = 'background-color:red;   color:white;'
const StylePass = 'background-color:green; color:white;'
const StyleWait = 'background-color:blue;  color:white;'

// all the tests
const Tests = {}

// html divs to write things to
let DivTests
let DivSummary
let DivErrors

let Running = true

// get everything set up before running the tests
init()

// initialize all the bits
function init () {
  DivSummary = document.querySelector('#summary')
  DivErrors = document.querySelector('#errors')
  DivTests = document.querySelector('#tests')

  DivSummary.innerText = 'tests starting shortly ...'
  tape.createStream({objectMode: true}).on('data', handleTapeOutput)
}

let lastTestFinishedTimeout

function handleTapeOutput (tapeOutput) {
  const id = tapeOutput.id
  const type = tapeOutput.type
  const name = tapeOutput.name
  const testId = tapeOutput.test

  switch (type) {
    case 'test':
      clearTimeout(lastTestFinishedTimeout)
      return addTest(id, name)
    case 'end':
      lastTestFinishedTimeout = setTimeout(testsDone, 1000)
      return
    case 'assert':
      const test = Tests[testId]
      if (test == null) {
        return console.log(`cannot find test with id ${testId}`)
      }

      return test.addAssert(tapeOutput)
  }

  console.log(`unknown tape output: ${JSON.stringify(tapeOutput, null, 4)}`)
}

function getSummary () {
  const result = {
    tests: 0,
    asserts: 0,
    fails: 0
  }

  for (let testId in Tests) {
    const test = Tests[testId]

    result.tests++
    result.asserts += test.assertCount
    result.fails += test.failCount
  }

  return result
}

function testsDone () {
  Running = false
  updateSummary()
}

function addTest (id, name) {
  const test = new Test(id, name)
  Tests[id] = test
}

class Test {
  constructor (id, name) {
    this.id = id
    this.name = name
    this.asserts = []

    const escName = escapeHTML(name)

    appendHTML(DivTests, `<div class="test" id="test-${id}">
      <h1 style="${StylePass}">
        ${escName}
        <i>(<span class="counts"></span>)</i>
      </h1>
      <div class="asserts"></div>
      </div>`
    )

    this.divHead = getElement(`#test-${id} h1`)
    this.divCounts = getElement(`#test-${id} .counts`)
    this.divAsserts = getElement(`#test-${id} .asserts`)
    this.assertCount = 0
    this.failCount = 0
  }

  addAssert (assert) {
    this.assertCount++
    this.asserts.push(assert)

    if (assert.ok === false) {
      this.divHead.style = StyleFail
      this.failCount++
    }

    // update counters
    let countStyle = StylePass
    let countString = `asserts: ${this.assertCount}`
    if (this.failCount > 0) {
      countStyle = StyleFail
      countString += ` , fails: ${this.failCount}`
    }

    this.divCounts.style = countStyle
    setHTML(this.divCounts, countString)

    // update asserts
    assert = JSON.parse(JSON.stringify(assert))

    const failed = assert.ok === false
    let assertString = assert.name
    let assertStyle = ''

    delete assert.id
    delete assert.ok
    delete assert.name
    delete assert.type

    if (failed) {
      assertStyle = StyleFail
    }

    let html = `<div style="${assertStyle}; margin-left:2em">${assertString}</div>`

    appendHTML(this.divAsserts, html)

    if (failed) {
      DivErrors.style = 'display: block'

      html = `<h1 style="${StyleFail}">${escapeHTML(this.name)}</h1>${html}`
      appendHTML(DivErrors, html)

      const json = escapeHTML(JSON.stringify(assert, null, 4))
      html = `<pre style="margin-left:2em">${json}</pre>`
      appendHTML(this.divAsserts, html)
      appendHTML(DivErrors, html)
    }

    // update summary
    updateSummary()
  }
}

function updateSummary () {
  const summary = getSummary()
  let summaryStyle = StyleWait
  let summaryText = `tests: ${summary.tests}; asserts: ${summary.asserts}`

  if (!Running) {
    summaryStyle = (summary.fails > 0) ? StyleFail : StylePass
  }

  if (summary.fails > 0) {
    summaryText += `; fails: ${summary.fails}`
  }

  summaryText += `; status: ${Running ? 'running' : 'finished'}`

  DivSummary.style = summaryStyle
  setHTML(DivSummary, summaryText)
}

function setHTML (div, html) {
  div.innerHTML = html
}

function appendHTML (div, html) {
  div.innerHTML += html
}

function getElement (selector) {
  return document.querySelector(`${selector}`)
}

function escapeHTML (string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
