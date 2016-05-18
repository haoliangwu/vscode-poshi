import * as path from 'path'

import { workspace, languages, commands, window, Uri } from 'vscode'
import { LanguageClient, TransportKind } from 'vscode-languageclient'

import { PEEK_FILTER, SYMBOL_FILTER, HOVER_FILTER, MACRO_LENS_FILTER } from './util/filterUtil'
import { initMapping, mapping } from './util/mappingUtil'

import PeekFileDefinitionProvider from './definition/PeekFileDefinitionProvider'
import SymbolProvider from './symbol/SymbolProvider'
import HoverProvider from './hover/HoverProvider'
import MacroLensProvider from './lens/MacroLensProvider'
// import LogContentProvider from './content/LogContentProvider'

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
    // installed message
    window.showInformationMessage(`The poshi source mapping has initilized successfully.`)
    return initMapping(wholePath)
  }
}

export function activate (context) {
  try {
    // init
    workspace.onDidChangeConfiguration(init)
    init()

    // preview log
    commands.registerCommand('POSHI.previewlog', () => {
      commands.executeCommand(
        'vscode.previewHtml',
        Uri.file('/home/lyon/liferay/portal/portal-6210/portal-web/test-results/ApplicationdisplaytemplatesUsecase_ADTWiki/index.html')
      )
    })

    // quick pick
    commands.registerCommand('POSHI.quickpick', () => {
      //   window.showInformationMessage(`${env.machineId}`)
      try {
        const inputOpts = {
          placeHolder: 'eg:testcaseName#commandName',
          validateInput: function (input) {
            if (input.indexOf('#') < 0) return 'The input string should contian # mark.'

            const reg = /\w+#\w+/i

            if (!reg.test(input)) {
              return 'The input string is not valid.'
            }
          }
        }

        const pending = window.showInputBox(inputOpts)

        pending.then(input => {
          if (!input) return

          const {uri} = mapping.testcase.get(input.split('#')[0])

          if (uri) {
            workspace.openTextDocument(uri).then(doc => {
              window.showTextDocument(doc)
            })
          } else window.showInformationMessage(`Cannot quick pick file by this testcase name.`)
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

    // workspace register
    // log content provider
    // context.subscriptions.push(workspace.registerTextDocumentContentProvider('log', new LogContentProvider()))

    // languages register
    // lang server
    context.subscriptions.push(langServer)

    // peek definition provider
    context.subscriptions.push(languages.registerDefinitionProvider(PEEK_FILTER, new PeekFileDefinitionProvider()))

    // symbol provider
    context.subscriptions.push(languages.registerDocumentSymbolProvider(SYMBOL_FILTER, new SymbolProvider()))

    // hover provider
    context.subscriptions.push(languages.registerHoverProvider(HOVER_FILTER, new HoverProvider()))

    // lens provider
    context.subscriptions.push(languages.registerCodeLensProvider(MACRO_LENS_FILTER, new MacroLensProvider()))
  } catch (error) {
    window.showInformationMessage(`There are some problems during initial process, please contact author by https://github.com/haoliangwu/vscode-poshi/issues.`)
    console.log(error.stack)
  }
}

export function deactivate () {
}
