import { SymbolKind, SymbolInformation } from 'vscode'
import { mappingCommandLine } from '../util/mappingUtil'
import * as fileUtil from '../util/fileUtil'

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

    for (const [name, file] of map) {
      symbolItems.push(new SymbolInformation(name, SymbolKind.Method, file.range))
    }

    return symbolItems
  }
}
