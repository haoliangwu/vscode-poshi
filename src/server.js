import { IPCMessageReader, IPCMessageWriter, createConnection, TextDocuments } from 'vscode-languageserver'
import * as fileUtil from './util/fileUtil'

// conection instance
const connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process))

// sync documents
const documents = new TextDocuments()

import LinterProvider from './server/LinterProvider'
import CompletionProvider from './server/CompletionProvider'

const linterProvider = new LinterProvider(connection)
const completionProvider = new CompletionProvider()

let settings = {}

documents.listen(connection)

try {
  // init
  connection.onInitialize((params) => {
    //   connection.console.log('init obj:')
    //   connection.console.log(params)

    //   const workspaceRoot = params.rootPath
    return {
      capabilities: {
        textDocumentSync: documents.syncKind,
        completionProvider: {
          resolveProvider: true,
          triggerCharacters: ['#']
        }
      }
    }
  })

  // doc content change event
  documents.onDidChangeContent(change => {
    const doc = change.document

    // linters
    try {
      const diagnostics = linterProvider.doLinter(doc)

      connection.console.log(diagnostics.length)
      connection.sendDiagnostics({uri: doc.uri, diagnostics})
    } catch (error) {
      connection.console.log(error.stack)
    }
  })

  // completion
  connection.onCompletion((textDocumentPosition) => {
    try {
      const {textDocument, position} = textDocumentPosition
      const lines = documents.get(textDocument.uri).getText().split(/\r?\n/g)

      // change line content
      const change = lines[position.line]

      // connection.console.log(`Change: `)
      // connection.console.log(change)

      // TODO 获取更为准确的change内容，而不是一整行(DONE)
      // const match = change.match(/(\w+)="(\w+)+#?/)
      const match = fileUtil.getChangeTextByCursor(change, position.character)

      // connection.console.log('Match: ')
      // connection.console.log(match)

      // generate completionItems
      if (match) return completionProvider.retriveCommandName(match, connection)
    } catch (error) {
      connection.console.log(`${error.stack}`)
      connection.window.showErrorMessage(`Lang Server completion request failed by error: ${error.stack}`)
    }
  })

  // completion reslove
  connection.onCompletionResolve((item) => {
    //   try {
    //     const {detail, documentation} = completion.completionInfoSource[item.data - 1]
    //     item.detail = detail
    //     item.documentation = documentation

    //     return item
    //   } catch (error) {
    //     console.log(error.stack)
    //   }
    return item
  })

  // option change event
  connection.onDidChangeConfiguration((change) => {
    settings = change.settings
    completionProvider.init(settings, connection)
    //   maxNumberOfProblems = settings.languageServerExample.maxNumberOfProblems || 100

    documents.all().forEach(linterProvider.doLinter)
  })

  /*
  connection.onDidOpenTextDocument((params) => {
    // A text document got opened in VSCode.
    // params.uri uniquely identifies the document. For documents store on disk this is a file URI.
    // params.text the initial full content of the document.
    connection.console.log(`${params.uri} opened.`)
  })
  connection.onDidChangeTextDocument((params) => {
    // The content of a text document did change in VSCode.
    // params.uri uniquely identifies the document.
    // params.contentChanges describe the content changes to the document.
    connection.console.log(`${params.uri} changed: ${JSON.stringify(params.contentChanges)}`)
  })
  connection.onDidCloseTextDocument((params) => {
    // A text document got closed in VSCode.
    // params.uri uniquely identifies the document.
    connection.console.log(`${params.uri} closed.`)
  })*/

  connection.listen()
  connection.window.showInformationMessage(`Lang Server is listening the editor client.`)
} catch (error) {
  connection.window.showErrorMessage(`Lang Server failed to start up due to: ${error.stack}.`)
}
