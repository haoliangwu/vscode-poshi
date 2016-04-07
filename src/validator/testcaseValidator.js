import { DiagnosticSeverity } from 'vscode-languageserver'
import { commandStandardRegex, commandRegex } from '../util/regexUtil'

export function validateCommand (entry, diagnostics) {
  const [i, line] = entry
  const commandItems = line.match(commandRegex)

  if (commandItems) {
    commandItems.forEach(e => {
      const index = line.indexOf(e)
      const equalSignIndex = e.indexOf('=')
      const commandStrOffset = e.split('=')[1].length

      if (commandStandardRegex.testcase.test(e)) {
        return
      } else {
        diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: i, character: index + equalSignIndex + 2 },
            end: { line: i, character: index + equalSignIndex + commandStrOffset }
          },
          message: `Command name's first letter should be capitalized`,
          source: 'ex'
        })
      }
    })
  }
}
