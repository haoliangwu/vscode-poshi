import { DiagnosticSeverity } from 'vscode-languageserver'
import * as fs from 'fs'
import * as path from 'path'
// import * as reg from '../util/regexUtil'

const DefinedAttrs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../metrics/definedAttrs.json'), 'utf-8'))

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
  let range

  lines.forEach((e, i) => {
    const match = temp.match(/<(definition|command|execute|tear-down|set-up)[\w\s"=#]*>\s{2,}/)

    if (!match) {
      temp += e.trim() + '\n'
      return
    }

    connection.console.log(temp)

    temp = ''

    range = {
      start: {line: i, character: 0},
      end: {line: i, character: 1}
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

export function noNewLineAfterLastChild (lines, diagnositics, connection) {
  let temp = ''
  let range

  lines.forEach((e, i) => {
    const match = temp.match(/\s{2,}<\/(definition|command|execute|tear-down|set-up)>/)

    if (!match) {
      temp += e.trim() + '\n'
      return
    }

    connection.console.log(temp)

    temp = ''

    range = {
      start: {line: i - 1, character: 0},
      end: {line: i - 1, character: 1}
    }

    const diagnostic = {
      severity: DiagnosticSeverity.Error,
      message: 'no new line after last child tag',
      source: 'poshi linter',
      code: 'g-1-3',
      range: range
    }

    diagnositics.push(diagnostic)
  })
}

export function withSpaceDelimiterInSelfClosedTag (lines, diagnositics, connection) {
  lines.forEach((e, i) => {
    const match = e.match(/<.*\/>/)

    if (!match) return

    const ruleMatch = e.match(/<.*(\s)\/>/)

    if (ruleMatch) return

    const range = {
      start: {line: i, character: e.length - 2},
      end: {line: i, character: e.length - 1}
    }

    const diagnostic = {
      severity: DiagnosticSeverity.Error,
      message: 'should have one space as delimiter in self closed tag',
      source: 'poshi linter',
      code: 'g-1-4',
      range: range
    }

    diagnositics.push(diagnostic)
  })
}

export function invalidAttrsCheck (lines, diagnositics, connection) {
  lines.forEach((e, i) => {
    let range
    let message
    let code

    const attrs = e.match(/[\w-]+=".+?"/g)

    if (!attrs) return

    attrs.forEach(attr => {
      const match = attr.match(/([\w-]+)(?=\=)/)

      if (!match) return

      if (DefinedAttrs[match[1]] > 0) return

      connection.console.log(match[1])

      message = `The attr ${match[1]} is not in defined attr list`
      code = 'g-2-1'

      const start = e.indexOf(match[1])

      range = {
        start: { line: i, character: start },
        end: { line: i, character: start + match[1].length }
      }

      const diagnostic = {
        severity: DiagnosticSeverity.Warning,
        message: message,
        source: 'poshi linter',
        code: code,
        range: range
      }

      diagnositics.push(diagnostic)
    })
  })
}
