import { window, StatusBarAlignment } from 'vscode'
import * as fileUtil from '../util/fileUtil'
import * as reg from '../util/regexUtil'

export default class PoshiStatusBar {
  constructor (props) {
    this._pluginsItem = window.createStatusBarItem(StatusBarAlignment.Left)
    this._testcaseItem = window.createStatusBarItem(StatusBarAlignment.Left)
  }

  init () {
    const editor = window.activeTextEditor
    if (!editor) {
      this._hide()
      return
    }

    this.update()
  }

  update () {
    const editor = window.activeTextEditor
    if (!editor) {
      this._hide()
      return
    }

    const doc = editor.document

    if (doc.languageId === 'xml' && fileUtil.getExtName(doc.fileName) === 'testcase') {
      const plugins = this._getDependencyPlugins(doc)
      const testcasesTotal = this._getTestcaseTotal(doc)

      this._pluginsItem.text = `Dependency Plugins: ${plugins.length > 0 ? plugins : 'None'}`
      this._pluginsItem.show()

      this._testcaseItem.text = `TestCase Total: ${testcasesTotal}`
      this._testcaseItem.show()
    } else {
      this._hide()
    }
  }

  dispose () {
    this._pluginsItem.dispose()
  }

  _getComponentName (doc) {
    const firstLineText = doc.lineAt(0).text

    const match = firstLineText.match(/component-name="(.+)"/)

    if (!match) {
      this._pluginsItem.hide()
      return
    }

    return match[1]
  }

  _getDependencyPlugins (doc) {
    const properties = this._getProperties(doc)
    const result = []

    for (const [name, val] of properties) {
      if (name.indexOf('plugins') < 0) continue

      result.push(val)
    }

    return result
  }

  _getProperties (doc) {
    const properties = doc.getText().match(/<property name="(.+)" value="(.+)" \/>/g)

    if (properties.length > 0) {
      const resultMap = new Map()

      properties.forEach(text => {
        const match = text.match(/<property name="(.+)" value="(.+)" \/>/)

        if (match) {
          resultMap.set(match[1], match[2])
        }
      })

      return resultMap
    }
  }

  _getTestcaseTotal (doc) {
    const properties = doc.getText().match(reg.commandRegex)

    return properties.length
  }

  _hide () {
    this._testcaseItem.hide()
    this._pluginsItem.hide()
  }
}
