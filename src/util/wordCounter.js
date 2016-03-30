import {
  window,
  StatusBarAlignment
} from 'vscode'

export default class WordCounter {
  updateWordCount() {
    // Create as needed
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

    // Only update status if an MarkDown file
    if (doc.languageId === 'markdown') {
      let wordCount = this._getWordCount(doc)

      // Update the status bar
      this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word'
      this._statusBarItem.show()
    } else {
      this._statusBarItem.hide()
    }
  }

  _getWordCount(doc) {
    let docContent = doc.getText()

    docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ')
    docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    let wordCount = 0
    if (docContent !== '') {
      wordCount = docContent.split(' ').length
    }

    return wordCount
  }

  dispose() {
    this._statusBarItem.dispose()
  }
}
