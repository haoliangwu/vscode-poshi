import {
  window,
  commands,
  Disposable,
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument
} from 'vscode'

import WordCounter from './util/wordCounter'
import WordCounterController from './util/wordCounterController'

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context) {

  // Use the console to output diagnostic information (console.log) and errors (console.error).
  // This line of code will only be executed once when your extension is activated.

  // create a new word counter
  let wordCounter = new WordCounter(),
    controller = new WordCounterController(wordCounter)

  // Add to a list of disposables which are disposed when this extension is deactivated.
  context.subscriptions.push(wordCounter)
  context.subscriptions.push(WordCounterController)
}
