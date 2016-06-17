import { SymbolKind, SymbolInformation } from 'vscode'
import { mappingCommandLine } from '../util/mappingUtil'
import * as fileUtil from '../util/fileUtil'
import * as vscodeUtil from '../util/vscodeUtil'

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
    const fileName = fileUtil.getFileName(document.fileName)

    const map = mappingCommandLine[fileName]

    if (!map) return

    for (const [name, props] of map) {
      const [line, start, end] = props.location
      symbolItems.push(new SymbolInformation(name, SymbolKind.Method, vscodeUtil.getRange(line, start, end)))
    }

    return symbolItems
  }
}
