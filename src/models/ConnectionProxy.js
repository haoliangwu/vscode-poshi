import { IPCMessageReader, IPCMessageWriter, createConnection, TextDocuments } from 'vscode-languageserver'
import * as fileUtil from '../util/fileUtil'
import LinterProvider from '../server/LinterProvider'
import CompletionProvider from '../server/CompletionProvider'

const linterProvider = new LinterProvider()
const completionProvider = new CompletionProvider()

let settings = {}

const documents = new TextDocuments()
const connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process))

documents.listen(connection)

// init
connection.onInitialize((params) => {
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

    const match = fileUtil.getChangeTextByCursor(change, position.character)

    // generate completionItems
    if (match) return completionProvider.retriveCommandName(match)
  } catch (error) {
    connection.console.log(`${error.stack}`)
    connection.window.showErrorMessage(`Lang Server completion request failed by error: ${error.stack}`)
  }
})

// completion reslove
connection.onCompletionResolve((item) => {
  return item
})

// option change event
connection.onDidChangeConfiguration((change) => {
  settings = change.settings
  completionProvider.init(settings)

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

export { connection }
