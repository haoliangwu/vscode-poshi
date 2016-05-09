import * as path from 'path'

import { workspace, languages, commands, window } from 'vscode'
import { LanguageClient, TransportKind } from 'vscode-languageclient'

import { PEEK_FILTER, SYMBOL_FILTER, HOVER_FILTER } from './util/filterUtil'
import { initMapping } from './util/mappingUtil'

import PeekFileDefinitionProvider from './definition/PeekFileDefinitionProvider'
import SymbolProvider from './symbol/SymbolProvider'
import HoverProvider from './hover/HoverProvider'

export function init () {
  const settings = workspace.getConfiguration('poshi')

  const liferayHOME = settings.liferay.home
  const poshiHOME = settings.project.home

  const wholePath = liferayHOME + poshiHOME

  if (!wholePath && wholePath === '') {
    window.showInformationMessage(`Your Liferay Home or POSHI Project HOME is null, please set them !!`)
  } else if (!wholePath.match(/portal-web/)) {
    window.showInformationMessage(`Your Liferay Home or POSHI Project HOME is not the valid path, please correct them or refer to example/package.json.`)
  } else {
    window.showInformationMessage(`POSHI Project initilized successfully.`)
    return initMapping(wholePath)
  }
}

export function activate (context) {
  try {
    // init
    workspace.onDidChangeConfiguration(init)
    init()

    // quick pick
    commands.registerCommand('POSHI.quickpick', () => {
      //   window.showInformationMessage(`${env.machineId}`)
      try {
        const inputOpts = {
          placeHolder: 'eg:testcaseName#commandName',
          validateInput: function (input) {
            const reg = /\w+#\w+/

            if (reg.test(input)) {
              return input
            } else {
              window.showInformationMessage("The input string isn't valid.")
            }
          }
        }

        const pending = window.showInputBox(inputOpts)

        pending.then(input => {
          window.showInformationMessage(input)
        })
      } catch (error) {
        console.log(error.stack)
      }
    })

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
        configurationSection: 'poshi',
        fileEvents: workspace.createFileSystemWatcher('package.json')
      }
    }

    const langServer = new LanguageClient('POSHI Language Server', serverOptions, clientOptions).start()

    context.subscriptions.push(langServer)

    // peek definition provider
    context.subscriptions.push(languages.registerDefinitionProvider(PEEK_FILTER, new PeekFileDefinitionProvider()))

    // symbol provider
    context.subscriptions.push(languages.registerDocumentSymbolProvider(SYMBOL_FILTER, new SymbolProvider()))

    // hover provider
    context.subscriptions.push(languages.registerHoverProvider(HOVER_FILTER, new HoverProvider()))

    // installed message
    window.showInformationMessage(`The poshi source mapping has initilized successfully.`)
  } catch (error) {
    window.showInformationMessage(`There are some problems during initial process, please contact author by https://github.com/haoliangwu/vscode-poshi/issues.`)
    console.log(error.stack)
  }
}

export function deactivate () {
}
