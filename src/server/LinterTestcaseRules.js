import { DiagnosticSeverity } from 'vscode-languageserver'
import * as reg from '../util/regexUtil'

export function upperCamelCaseCommandName (lines, diagnositics) {
  lines.forEach((e, i) => {
    const match = e.match(reg.commandRegexGroup)
    let range

    if (!match) {
      return
    }

    if (reg.commandStandardRegex.testcase.test(match[1])) return

    const offset = e.indexOf('=')

    range = {
      start: { line: i, character: match.index + offset + 1 },
      end: { line: i, character: match.index + offset + 1 + match[1].length }
    }

    const diagnostic = {
      severity: DiagnosticSeverity.Error,
      message: 'Use upper camel case to name testcase command',
      source: 'poshi linter',
      code: 't-1-1',
      range: range
    }

    diagnositics.push(diagnostic)
  })
}
