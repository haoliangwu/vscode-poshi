import * as path from 'path'

import { workspace, languages, commands, window, env } from 'vscode'
import { LanguageClient, TransportKind } from 'vscode-languageclient'

import WordCounter from './util/wordCounter'
import WordCounterController from './util/wordCounterController'
import PeekFileDefinitionProvider from './definition/PeekFileDefinitionProvider'

const PEEK_FILTER = [
  {
    language: 'xml',
    scheme: 'file'
  }
]

export function activate (context) {
  // registe package.json commands
  commands.registerCommand('POSHI.sync', () => {
    window.showInformationMessage(`${env.machineId}`)
  })

  // command counter
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
    documentSelector: ['xml'],
    synchronize: {
      configurationSection: 'languageServerExample',
      fileEvents: workspace.createFileSystemWatcher('package.json')
    }
  }

  context.subscriptions.push(new LanguageClient('POSHI Language Server', serverOptions, clientOptions).start())

  // peek definition provider
  context.subscriptions.push(languages.registerDefinitionProvider(PEEK_FILTER, new PeekFileDefinitionProvider()))

  // installed message
  window.showInformationMessage(`The poshi extension has been installed successfully.`)
}

export function deactivate () {
}
