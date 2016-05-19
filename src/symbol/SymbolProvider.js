import { SymbolKind, Range, Position, SymbolInformation } from 'vscode'
import * as reg from '../util/regexUtil'

export default class SymbolProvider {
  constructor (conf) {
    this.conf = conf
  }

  get type () {
    return 'symbol'
  }

  get selector () {
    return {
      language: 'xml',
      scheme: 'file'
    }
  }

  provideDocumentSymbols (document, token) {
    const symbolItems = []
    const content = document.getText()
    const lines = content.split(reg.linesRegex)

    lines.forEach((e, i) => {
      const match = e.match(reg.commandRegexGroup)

      if (match) {
        const match_start = match[0].match(reg.commandName).index
        const match_end = match.index + match[1].length

        // console.log(`Position: line ${i} start ${match_start} end ${match_end}`)
        const range = new Range(
          new Position(i, Math.max(0, match_start - 1)),
          new Position(i, Math.max(0, match_end - 1))
        )

        const commandName = match[1]

        symbolItems.push(new SymbolInformation(commandName, SymbolKind.Key, range))
      }
    })

    return symbolItems
  }
}
