import { IPCMessageReader, IPCMessageWriter, createConnection, TextDocuments, DiagnosticSeverity } from 'vscode-languageserver'

let connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process))

let documents = new TextDocuments()

documents.listen(connection)

let workspaceRoot

connection.onInitialize((params) => {
  workspaceRoot = params.rootPath
  return {
    capabilities: {
      // Tell the client that the server works in FULL text document sync mode
      textDocumentSync: documents.syncKind,
      completionProvider: {
        resolveProvider: true
      }
    }
  }
})

documents.onDidChangeContent((change) => {
  validateTextDocument(change.document)
})

function validateTextDocument (textDocument) {
  let diagnostics = []
  let lines = textDocument.getText().split(/\r?\n/g)
  let problems = 0
  for (var i = 0; i < lines.length && problems < 100; i++) {
    let line = lines[i]
    let index = line.indexOf('command')
    if (index >= 0) {
      problems++
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: {line: i, character: index},
          end: { line: i, character: index + 7 }
        },
        message: `${line.substr(index, 7)} should be spelled Command`,
        source: 'ex'
      })
    }
  }
  // Send the computed diagnostics to VSCode.
  connection.sendDiagnostics({uri: textDocument.uri, diagnostics})
}

connection.listen()
