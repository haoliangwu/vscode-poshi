import * as path from 'path'

import { workspace, languages, commands, window } from 'vscode'
import { LanguageClient, TransportKind } from 'vscode-languageclient'

import { quickPickCommand } from './commands'

// import { PEEK_FILTER, SYMBOL_FILTER, HOVER_FILTER, MACRO_LENS_FILTER } from './util/filterUtil'
import { initMapping } from './util/mappingUtil'

import PeekFileDefinitionProvider from './definition/PeekFileDefinitionProvider'
import SymbolProvider from './symbol/SymbolProvider'
import HoverProvider from './hover/HoverProvider'
import MacroLensProvider from './lens/MacroLensProvider'
// import LogContentProvider from './content/LogContentProvider'

// disposable list
const disposables = []

// provider list
const providers = [
  new PeekFileDefinitionProvider(),
  new SymbolProvider(),
  new HoverProvider(),
  new MacroLensProvider()
]

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

    const opts = {
      url: wholePath
    }

    return initMapping(opts)
  }
}

export function activate (context) {
  try {
    // init
    workspace.onDidChangeConfiguration(init)

    init()

    // quick pick
    commands.registerCommand('POSHI.quickpick', quickPickCommand)

    // lang server
    let serverModule = path.join(__dirname, './server.js')
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

    providers.forEach(provider => {
      let register

      switch (provider.type) {
        case 'definition':
          register = languages.registerDefinitionProvider
          break
        case 'symbol':
          register = languages.registerDocumentSymbolProvider
          break
        case 'hover':
          register = languages.registerHoverProvider
          break
        case 'lens':
          register = languages.registerCodeLensProvider
          break
      }

      disposables.push(
        register(
          provider.selector,
          provider
        )
      )
    })

    // // peek definition provider
    // context.subscriptions.push(languages.registerDefinitionProvider(PEEK_FILTER, new PeekFileDefinitionProvider()))

    // // symbol provider
    // context.subscriptions.push(languages.registerDocumentSymbolProvider(SYMBOL_FILTER, new SymbolProvider()))

    // // hover provider
    // context.subscriptions.push(languages.registerHoverProvider(HOVER_FILTER, new HoverProvider()))

    // // lens provider
    // context.subscriptions.push(languages.registerCodeLensProvider(MACRO_LENS_FILTER, new MacroLensProvider()))

    context.subscriptions.push(...disposables)
  } catch (error) {
    window.showInformationMessage(`There are some problems during initial process, please contact author by https://github.com/haoliangwu/vscode-poshi/issues.`)
    console.log(error.stack)
  }
}

export function deactivate () {
}
