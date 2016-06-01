import { DiagnosticSeverity } from 'vscode-languageserver'
// import * as reg from '../util/regexUtil'

export function selfClosedWithNoChild (lines, diagnositics, connection) {
  lines.forEach((e, i) => {
    const match = e.match(/<(\w+)\s.*><\/\1>/)
    let range

    if (!match) {
      return
    }

    range = {
      start: {line: i, character: match.index},
      end: {line: i, character: e.length}
    }

    const diagnostic = {
      severity: DiagnosticSeverity.Error,
      message: 'Use self-closed tag without child tags',
      source: 'poshi linter',
      code: 'g-1-1',
      range: range
    }

    diagnositics.push(diagnostic)
  })
}

export function noNewLineBeforeFirstChild (lines, diagnositics, connection) {
  let temp = ''
  // let line = 0
  let range

  lines.forEach((e, i) => {
    const match = temp.match(/<(definition|command|execute)[\w\s"=#]+>\s{2,}/)

    if (!match) {
      temp += e.trim() + '\n'
      return
    }

    connection.console.log(temp)

    temp = ''

    range = {
      start: {line: i, character: 0},
      end: {line: i, character: e.length}
    }

    const diagnostic = {
      severity: DiagnosticSeverity.Error,
      message: 'no new line before first child tag',
      source: 'poshi linter',
      code: 'g-1-2',
      range: range
    }

    diagnositics.push(diagnostic)
  })
}
