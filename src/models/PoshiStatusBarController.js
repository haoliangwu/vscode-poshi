import { window, Disposable } from 'vscode'

export default class PoshiStatusBarController {
  constructor (statusBar) {
    this._statusBar = statusBar
    this._statusBar.init()

    const subscriptions = []

    window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions)
    window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions)

    // update the counter for the current file
    this._statusBar.update()

    // create a combined disposable from both event subscriptions
    this._disposable = Disposable.from(...subscriptions)
  }

  dispose () {
    this._disposable.dispose()
  }

  _onEvent () {
    this._statusBar.update()
  }

}
