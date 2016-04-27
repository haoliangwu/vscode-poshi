import { workspace, Hover, Range, Position } from 'vscode'
import * as reg from '../util/regexUtil'

export default class HoverProvider {
  constructor (props) {
    this._conf = workspace.getConfiguration('poshi')
  }

  provideHover (document, position, token) {
    const content = document.getText()
    const lines = content.split(reg.linesRegex)
    
  }
}
