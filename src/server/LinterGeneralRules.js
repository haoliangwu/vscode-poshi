import { DiagnosticSeverity } from 'vscode-languageserver'
import * as reg from '../util/regexUtil'

export function selfClosedWithNoChild (doc) {
  const lines = doc.getText().split(reg.linesRegex)
  const diagnostics = []

  let temp = ''

  lines.forEach((e, i) => {
    const match = e.match(/<(\w+)\s.*><\/\1>/)
    let range

    if (match) {
      range = {
        start: {line: i, character: match.index},
        end: {line: i, character: e.length}
      }
    } else {
      temp += e

      const match = temp.match(/<.*\s>[\s\S]*?<\/.*>/)

      if (match) {
        range = {
          start: {line: i, character: match.index},
          end: {line: i, character: e.length}
        }

        temp = ''
      }
    }

    if (!range) return

    const diagnostic = {
      severity: DiagnosticSeverity.Error,
      message: 'Use self-closed tag without child tags',
      source: 'poshi linter',
      code: 'g-1-1',
      range: range
    }

    diagnostics.push(diagnostic)
  })

  return diagnostics
}
