import { DiagnosticSeverity } from 'vscode-languageserver'
import * as path from 'path'
import * as fs from 'fs'
import * as reg from '../util/regexUtil'

const DefinedActions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../metrics/definedActions.json'), 'utf-8'))

// error level
export function lowerCamelCaseCommandName (lines, diagnositics, connection) {
  lines.forEach((e, i) => {
    const match = e.match(reg.commandRegexGroup)
    let range

    if (!match) {
      return
    }

    if (reg.commandStandardRegex.macro.test(match[1])) return

    const offset = e.indexOf('=')

    range = {
      start: { line: i, character: match.index + offset + 1 },
      end: { line: i, character: match.index + offset + 1 + match[1].length }
    }

    const diagnostic = {
      severity: DiagnosticSeverity.Error,
      message: 'Use upper camel case to name testcase command',
      source: 'poshi linter',
      code: 'm-1-1',
      range: range
    }

    diagnositics.push(diagnostic)
  })
}

// warning level
export function actionOfCommandName (lines, diagnositics, connection) {
  lines.forEach((e, i) => {
    const match = e.match(reg.commandRegexGroup)
    let range
    let message
    let code

    if (!match) {
      return
    }

    const action = match[1].match(reg.macroCommandOrderRegex.action)

    if (!action) {
      message = 'Lack of [action] segment, eg: add, edit, delete.'
      code = 'm-2-2'
    }

    // undefined or value is 0
    if (DefinedActions[action[1]] > 0) return

    message = `The action ${action[1]} is not in defined action list`
    code = 'm-2-3'

    const offset = e.indexOf('=')

    range = {
      start: { line: i, character: match.index + offset + 1 },
      end: { line: i, character: match.index + offset + 1 + match[1].length }
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

// hint level
export function scopeOfCommandName (lines, diagnositics, connection) {
  lines.forEach((e, i) => {
    const match = e.match(reg.commandRegexGroup)
    let range

    if (!match) {
      return
    }

    if (reg.macroCommandOrderRegex.scope.test(match[1])) return

    const offset = e.indexOf('=')

    range = {
      start: { line: i, character: match.index + offset + 1 },
      end: { line: i, character: match.index + offset + 1 + match[1].length }
    }

    const diagnostic = {
      severity: DiagnosticSeverity.Hint,
      message: 'Lack of [CP/PG] limit, eg: tearDownCP',
      source: 'poshi linter',
      code: 'm-3-1',
      range: range
    }

    diagnositics.push(diagnostic)
  })
}

export function modifierOfCommandName (lines, diagnositics, connection) {
  lines.forEach((e, i) => {
    const match = e.match(reg.commandRegexGroup)
    let range

    if (!match) {
      return
    }

    if (reg.macroCommandOrderRegex.method.test(match[1])) return

    const offset = e.indexOf('=')

    range = {
      start: { line: i, character: match.index + offset + 1 },
      end: { line: i, character: match.index + offset + 1 + match[1].length }
    }

    const diagnostic = {
      severity: DiagnosticSeverity.Hint,
      message: 'Lack of [method] limit, eg: ViaActions, ViaAP',
      source: 'poshi linter',
      code: 'm-3-2',
      range: range
    }

    diagnositics.push(diagnostic)
  })
}
