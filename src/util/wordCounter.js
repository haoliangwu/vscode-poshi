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
