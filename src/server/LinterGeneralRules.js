import { DiagnosticSeverity } from 'vscode-languageserver'
import * as fs from 'fs'
import * as path from 'path'
// import * as reg from '../util/regexUtil'

// const IgnoreSegments = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../metrics/ignoreSegments.json'), 'utf-8'))
const DefinedAttrs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../metrics/definedAttrs.json'), 'utf-8'))
const DefinedTags = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../metrics/definedTags.json'), 'utf-8'))

export function selfClosedWithNoChild (lines, diagnositics) {
  lines.forEach((e, i) => {
    const match = e.match(/<(\w+)\s.*>[\w\s]+<\/\1>/)
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

export function noNewLineBeforeFirstChild (lines, diagnositics) {
  let temp = ''
  let range

  lines.forEach((e, i) => {
    const match = temp.match(/<(definition|command|execute|tear-down|set-up)[\w\s"=#]*>\s{2,}/)

    if (!match) {
      temp += e.trim() + '\n'
      return
    }

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

export function noNewLineAfterLastChild (lines, diagnositics) {
  let temp = ''
  let range

  lines.forEach((e, i) => {
    const match = temp.match(/\s{2,}<\/(definition|command|execute|tear-down|set-up)>/)

    if (!match) {
      temp += e.trim() + '\n'
      return
    }

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

export function withSpaceDelimiterInSelfClosedTag (lines, diagnositics) {
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

export function invalidAttrsCheck (lines, diagnositics) {
  lines.forEach((e, i) => {
    let range
    let message
    let code

    const attrs = e.match(/[\w-]+=".+?"/g)

    if (!attrs) return

    attrs.forEach(attr => {
      const match = attr.match(/([\w-]+)(?=\=)/)

      if (!match || DefinedAttrs[match[1]] > 0) return

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

export function invalidTagsCheck (lines, diagnositics) {
  lines.forEach((e, i) => {
    let range
    let message
    let code

    const match = e.match(/<\/?([\w-]+).*\s?\/?>/)

    if (!match || DefinedTags[match[1]] > 0) return

    message = `The tag ${match[1]} is not in defined tag list`
    code = 'g-2-2'

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
}

export function pureLinesCheck (lines, diagnositics) {
  lines.forEach((e, i) => {
    let range
    let message = 'The line should be pure'
    let code = 'g-1-5'

    const match = e.match(/<[\s\S]+>/)

    if (!match) return

    if (match[0].length === e.trim().length) return

    range = {
      start: { line: i, character: 0 },
      end: { line: i, character: e.length }
    }

    const diagnostic = {
      severity: DiagnosticSeverity.Error,
      message: message,
      source: 'poshi linter',
      code: code,
      range: range
    }

    diagnositics.push(diagnostic)
  })
}
