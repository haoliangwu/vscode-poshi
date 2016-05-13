import { workspace } from 'vscode'

export default class LogContentProvider {
  provideTextDocumentContent (uri) {
    return workspace.openTextDocument(uri).then(doc => {
      return doc.getText()
    })
  }
}
