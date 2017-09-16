'use strict'

exports.respan = respan

// given html from hljs, respan so that no span crosses lines
function respan (html) {
  // split lines, then each line into chunks
  const lines = html
    .split('\n')
    .map(chunkSplitter)

  return lines.join('\n')
}

// split a line into chunks of text, span start, span end
// {text:string, isSpanStart:boolean, isSpanEnd:boolean}
function chunkSplitter (line) {
}
