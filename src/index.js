import * as path from 'path'

import { workspace } from 'vscode'
import { LanguageClient, TransportKind } from 'vscode-languageclient'

import WordCounter from './util/wordCounter'
import WordCounterController from './util/wordCounterController'

export function activate (context) {
  let wordCounter = new WordCounter()
  let wordCounterController = new WordCounterController(wordCounter)

  context.subscriptions.push(wordCounter)
  context.subscriptions.push(wordCounterController)

  let serverModule = path.join(__dirname, 'server/server.js')
  let debugOptions = {
    execArgv: ['--nolazy', '--debug=5004']
  }

  let serverOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
  }

  let clientOptions = {
    documentSelector: ['html'],
    synchronize: {
      configurationSection: 'languageServerExample',
      fileEvents: workspace.createFileSystemWatcher('package.json')
    }
  }

  let disposable = new LanguageClient('Language Server Example', serverOptions, clientOptions).start()

  context.subscriptions.push(disposable)
}
