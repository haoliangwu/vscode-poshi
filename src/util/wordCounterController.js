import { window, Disposable } from 'vscode'

export default class WordCounterController {

  constructor (wordCounter) {
    this._wordCounter = wordCounter
    this._wordCounter.updateWordCount()

    // subscribe to selection change and editor activation events
    let subscriptions = []
    window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions)
    window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions)

    // update the counter for the current file
    this._wordCounter.updateWordCount()

    // create a combined disposable from both event subscriptions
    this._disposable = Disposable.from(...subscriptions)
  }

  dispose () {
    this._disposable.dispose()
  }

  _onEvent () {
    this._wordCounter.updateWordCount()
  }
}
