import { IPCMessageReader, IPCMessageWriter, createConnection, TextDocuments } from 'vscode-languageserver'
import { validateCommand } from '../validator/testcaseValidator'
const completion = require('../completion/CompletionProvider')

const connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process))
const documents = new TextDocuments()
let settings = {}

documents.listen(connection)

// init
connection.onInitialize((params) => {
  //   connection.console.log('init obj:')
  //   connection.console.log(params)

  //   const workspaceRoot = params.rootPath
  return {
    capabilities: {
      textDocumentSync: documents.syncKind,
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ['#']
      }
    }
  }
})

// bind events
documents.onDidChangeContent(change => {
  //   connection.console.log('change event fire ..')
  //   connection.console.log('did change content obj:')
  //   connection.console.log(change)

  validateTextDocument(change.document)
})

function validateTextDocument (doc) {
  const lines = doc.getText().split(/\r?\n/g)
  const ext = doc.uri.split('.')[1]

  let diagnostics = []

  for (let entry of lines.entries()) {
    switch (ext) {
      case 'testcase':
        validateCommand(entry, diagnostics)
        break
      case 'macro':
        break
      case 'function':
        break
      case 'path':
        break
      default:
        break
    }
  }

  connection.sendDiagnostics({uri: doc.uri, diagnostics})
}

// completion
connection.onCompletion((textDocumentPosition) => {
  //   connection.console.log(`Settings:`)
  //   connection.console.log(settings)

  const {uri, position} = textDocumentPosition
  const lines = documents.get(uri).getText().split(/\r?\n/g)

  // change line content
  const change = lines[position.line]

  connection.console.log(`Change: `)
  connection.console.log(change)

  const match = change.match(/(\w+)="(\w+)+(?=#)/)

  connection.console.log('Match: ')
  connection.console.log(match)

  // generate completionItems
  if (match) return completion.retriveCommandName(match[1], match[2])
  else return completion.completionSource
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
})

connection.onDidChangeConfiguration((change) => {
  settings = change.settings
  completion.init(settings)

  //   maxNumberOfProblems = settings.languageServerExample.maxNumberOfProblems || 100

  documents.all().forEach(validateTextDocument)
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
