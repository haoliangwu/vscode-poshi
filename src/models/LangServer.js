import * as path from 'path'
import { workspace } from 'vscode'
import { LanguageClient, TransportKind } from 'vscode-languageclient'

export default class LangServer {
  constructor () {
    this.serverModule = path.join(__dirname, '../server.js')
  }

  get client () {
    const debugOptions = {
      execArgv: ['--nolazy', '--debug=5004']
    }
    const serverOptions = {
      run: { module: this.serverModule, transport: TransportKind.ipc },
      debug: { module: this.serverModule, transport: TransportKind.ipc, options: debugOptions }
    }
    const clientOptions = {
      documentSelector: ['xml'],
      synchronize: {
        configurationSection: 'poshi',
        fileEvents: workspace.createFileSystemWatcher('package.json')
      }
    }
    return new LanguageClient('poshi', serverOptions, clientOptions).start()
  }

}
