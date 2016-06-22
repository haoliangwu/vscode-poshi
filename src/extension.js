import { workspace, languages, commands, window } from 'vscode'

import * as reference from '../metrics/reference'

import ExtensionConfiguration from './models/ExtensionConfiguration'
import LangServer from './models/LangServer'
import PoshiStatusBar from './models/PoshiStatusBar'
import PoshiStatusBarController from './models/PoshiStatusBarController'

import { quickPickCommand, quickOpenCommand } from './commands'
import { initMapping } from './util/mappingUtil'

import PeekFileDefinitionProvider from './definition/PeekFileDefinitionProvider'
import SymbolProvider from './symbol/SymbolProvider'
import WorkspaceSymbolProvider from './symbol/WorkspaceSymbolProvider'
import HoverProvider from './hover/HoverProvider'
import MacroLensProvider from './lens/MacroLensProvider'
import CompletionItemProvider from './completion/CompletionItemProvider'
import LocatorReferenceProvider from './reference/LocatorReferenceProvider'

export function init (conf) {
  reference.demo()

  if (!conf) conf = new ExtensionConfiguration()

  // languages.setLanguageConfiguration('xml', {wordPattern: /(-?\d.\d\w)|([^`~!\@@\%\^\&*()-\=+[{\]}\|\;\:\'\"\,.\<>\/\?\s]+)/g})

  try {
    const wholePath = conf.poshiHome

    if (!wholePath && wholePath === '') {
      window.showInformationMessage(`Your Liferay Home or POSHI Project HOME is null, please set them !!`)
    } else if (!wholePath.match(/portal-web/)) {
      window.showInformationMessage(`Your Liferay Home or POSHI Project HOME is not the valid path, please correct them or refer to example/package.json.`)
    } else {
      const opts = {
        url: wholePath
      }

      initMapping(opts)

      window.showInformationMessage(`The source mapping of POSHI extension has initialized successfully.`)
    }
  } catch (error) {
    console.log(error.stack)
    window.showInformationMessage(`There are some problems during initial process, please contact author by https://github.com/haoliangwu/vscode-poshi/issues.`)
  }
}

export function activate (context) {
  // extension configuration
  const conf = new ExtensionConfiguration()

  // disposable list
  const disposables = []

  // custom controllers
  const statusBar = new PoshiStatusBar()
  const controller = new PoshiStatusBarController(statusBar)

  disposables.push(controller)

  // provider list
  const providers = [
    new PeekFileDefinitionProvider(conf),
    new SymbolProvider(conf),
    new HoverProvider(conf),
    new MacroLensProvider(conf),
    new WorkspaceSymbolProvider(conf),
    new CompletionItemProvider(conf),
    new LocatorReferenceProvider(conf)
  ]

  // init
  init(conf)

  // registe events
  workspace.onDidChangeConfiguration(init)

  // registe commands
  disposables.push(commands.registerCommand('POSHI.quickpick', quickPickCommand))
  disposables.push(commands.registerCommand('POSHI.quickopen', quickOpenCommand))

  // registe lang server
  disposables.push(new LangServer().client)

  // registe lang providers
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
      case 'completion':
        register = languages.registerCompletionItemProvider
        break
      case 'workspaceSymbol':
        register = languages.registerWorkspaceSymbolProvider
        break
      case 'reference':
        register = languages.registerReferenceProvider
        break
    }

    const disposable = provider.selector ? register(provider.selector, provider) : register(provider)

    disposables.push(disposable)
  })

  context.subscriptions.push(...disposables)
}

export function deactivate () {
}
