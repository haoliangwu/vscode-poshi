import {
  window,
  commands,
  StatusBarAlignment
} from 'vscode'

export default class wordCounter {
  updateWordCount(context) {
    if (!this._statusBarItem) {
      this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
    }

    this._statusBarItem.command = 'js.projectStatus.command'
    context.subscriptions.push(commands.registerCommand('js.projectStatus.command', () => {

      window.showInformationMessage('Hello World!')

    }))

    // Get the current text editor
    let editor = window.activeTextEditor
    if (!editor) {
      this._statusBarItem.hide()
      return
    }

    let doc = editor.document

    // Only update status if an POSHI file
    if (doc.languageId === 'html') {
      let wordCount = this._getCommandSegmentCount(doc)


      // Update the status bar
      this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Commands` : '1 Command'
      this._statusBarItem.show()
    } else {
      this._statusBarItem.hide()
    }
  }

  _getCommandSegmentCount(doc) {
    let docContent = doc.getText()

    return docContent.match(/<command name=\"(\w+)\">/g).length
  }

  dispose() {
    this._statusBarItem.dispose()
  }
}
