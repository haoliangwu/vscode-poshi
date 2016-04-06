import { IPCMessageReader, IPCMessageWriter, createConnection, TextDocuments, DiagnosticSeverity } from 'vscode-languageserver'
import { commandRegex } from '../util/regexUtil'

const connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process))
const documents = new TextDocuments()

documents.listen(connection)

// the max number of diagnostics
let maxNumberOfProblems = 100

// init
connection.onInitialize((params) => {
  //   const workspaceRoot = params.rootPath
  return {
    capabilities: {
      textDocumentSync: documents.syncKind,
      completionProvider: {
        resolveProvider: true
      }
    }
  }
})

// bind events
documents.onDidChangeContent(change => {
  try {
    validateTextDocument(change.document)
  } catch (error) {
    connection.console.error(error.stack)
  }
})

function validateTextDocument (textDocument) {
  const lines = textDocument.getText().split(/\r?\n/g)
  let diagnostics = []
  let problems = 0

  for (var i = 0; i < lines.length && problems < maxNumberOfProblems; i++) {
    const line = lines[i]
    const commandWrongList = line.match(commandRegex.wrong)

    if (commandWrongList) {
      commandWrongList.forEach(e => {
        const index = line.indexOf(e)
        const equalSignIndex = e.indexOf('=')
        const commandStrOffset = e.split('=')[1].length

        if (index >= 0) {
          problems++
          diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: {
              start: { line: i, character: index + equalSignIndex + 2 },
              end: { line: i, character: index + equalSignIndex + commandStrOffset }
            },
            message: `Command name's first letter should be capitalized`,
            source: 'ex'
          })
        }
      })
    }
  }

  connection.sendDiagnostics({uri: textDocument.uri, diagnostics})
}

connection.onDidChangeConfiguration((change) => {
  const settings = change.settings

  maxNumberOfProblems = settings.languageServerExample.maxNumberOfProblems || 100

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
