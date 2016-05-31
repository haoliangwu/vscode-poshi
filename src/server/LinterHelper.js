import { DiagnosticSeverity } from 'vscode-languageserver'
import * as reg from '../util/regexUtil'

export function validateCommand (doc, diagnostics) {
  const lines = doc.getText().split(/\r?\n/g)

  lines.forEach((e, i) => {
    const commandItems = e.match(reg.commandRegex)

    if (commandItems) {
      commandItems.forEach(e => {
        const index = e.indexOf(e)
        const equalSignIndex = e.indexOf('=') + 1
        const commandStrOffset = e.split('=')[1].length

        if (reg.commandStandardRegex.testcase.test(e)) {
          return
        } else {
          diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: {
              start: { line: i, character: index + equalSignIndex + 2 },
              end: { line: i, character: index + equalSignIndex + commandStrOffset }
            },
            message: `Command name's first letter should be capitalized`,
            source: 'poshi-linter',
            code: 'tcn'
          })
        }
      })
    }
  })
}
