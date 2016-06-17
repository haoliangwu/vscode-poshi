import { SymbolKind, SymbolInformation, Uri } from 'vscode'
import { mappingCommandLine } from '../util/mappingUtil'
import * as vscodeUtil from '../util/vscodeUtil'

export default class WorkspaceSymbolProvider {
  constructor (conf) {
    this.conf = conf
    this._symbolItems = []
  }

  get type () {
    return 'workspaceSymbol'
  }

  provideWorkspaceSymbols (query, token) {
    if (this._symbolItems.length === 0) {
      for (const fileName in mappingCommandLine) {
        for (const [name, props] of mappingCommandLine[fileName]) {
          const [line, start, end] = props.location
          this._symbolItems.push(new SymbolInformation(`${fileName}#${name}`, SymbolKind.Method, vscodeUtil.getRange(line, start, end), Uri.file(props.uri)))
        }
      }
    }

    const symbolItems = this._symbolItems.filter(e => {
      return e.name.indexOf(query) >= 0
    })

    return symbolItems
  }
}
