import { workspace, languages, commands, window } from 'vscode'

import ExtensionConfiguration from './models/ExtensionConfiguration'
import LangServer from './models/LangServer'

import { quickPickCommand, quickOpenCommand } from './commands'
import { initMapping } from './util/mappingUtil'

import PeekFileDefinitionProvider from './definition/PeekFileDefinitionProvider'
import SymbolProvider from './symbol/SymbolProvider'
import HoverProvider from './hover/HoverProvider'
import MacroLensProvider from './lens/MacroLensProvider'

export function init (conf) {
  if (!conf) conf = new ExtensionConfiguration()

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

      window.showInformationMessage(`The poshi source mapping has initilized successfully.`)
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

  // provider list
  const providers = [
    new PeekFileDefinitionProvider(conf),
    new SymbolProvider(conf),
    new HoverProvider(conf),
    new MacroLensProvider(conf)
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
    }

    disposables.push(
      register(
        provider.selector,
        provider
      )
    )
  })

  context.subscriptions.push(...disposables)
}

export function deactivate () {
}
