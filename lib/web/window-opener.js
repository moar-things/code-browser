'use strict'

exports.open = open

function open (name) {
  name = `code-browser:${name}`

  const features = Object.assign(getWindowRect(), {
    menubar: 0,
    toolbar: 0,
    location: 0,
    personalbar: 0,
    resizable: 1,
    scrollbars: 0
  })

  const featuresString = Object.keys(features).map(toFeatureString).join(',')

  const result = window.open(window.location.href, name, featuresString)
  console.log(`window.open("${window.location.href}", "${name}"):`, result)
  console.log(`features:`, features)
  console.log(`features:`, featuresString)

  function toFeatureString (key) { return `${key}=${features[key]}` }
}

// get the size and location of the window to open, based on current window
function getWindowRect () {
  const screen = window.screen
  const winHeight = window.innerHeight
  const winWidth = window.innerWidth

  const winMinX = screen.availLeft
  const winMaxX = screen.availLeft + screen.availWidth - winWidth
  const winMinY = screen.availTop
  const winMaxY = screen.availTop + screen.availHeight - winHeight

  const winX = winMinX + (Math.random() * (winMaxX - winMinX))
  const winY = winMinY + (Math.random() * (winMaxY - winMinY))

  return {
    width: winWidth,
    height: winHeight,
    left: winX,
    top: winY
  }
}
