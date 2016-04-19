import * as path from 'path'

import { workspace, commands, window, env } from 'vscode'
import { LanguageClient, TransportKind } from 'vscode-languageclient'

import WordCounter from './util/wordCounter'
import WordCounterController from './util/wordCounterController'

export function activate (context) {
  // registe package.json commands
  commands.registerCommand('POSHI.demo', () => {
    window.showInformationMessage(`${env.machineId}`)
  })

  // word counter
  let wordCounter = new WordCounter()
  let wordCounterController = new WordCounterController(wordCounter)

  context.subscriptions.push(wordCounter)
  context.subscriptions.push(wordCounterController)

  // lang server
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

  let disposable = new LanguageClient('POSHI Language Server', serverOptions, clientOptions).start()

  context.subscriptions.push(disposable)
}
