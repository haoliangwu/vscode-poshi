import { workspace, Hover } from 'vscode'
import * as reg from '../util/regexUtil'

import { mappingVar, initMappingVar } from '../util/mappingUtil'

export default class HoverProvider {
  constructor (props) {
    initMappingVar()
    this._conf = workspace.getConfiguration('poshi')
  }

  provideHover (document, position, token) {
    // console.log('Document: ')
    // console.log(document)
    try {
      let curLine = position.line
      let line = document.lineAt(curLine)
      let curText = line.text

      // console.log('Line: ')
      // console.log(line)

      // the mapping key
      const match = curText.match(reg._varReferenceGroup)
      const hoverKey = match ? match[1] : ''
      console.log('HoverKEY: ' + hoverKey)

      // get the hover in which command block
      let commandBlock = ''

      while (true) {
        const match = curText.match(reg.commandRegexGroup)
        if (match || curLine === 0) {
          commandBlock = match[1]
          break
        } else {
          curLine--
          console.log(curLine)
          line = document.lineAt(curLine)
          curText = line.text
        }
      }
      console.log('Command Block: ' + commandBlock)
    } catch (error) {
      console.log(error.stack)
    }

    return new Hover('I am a hover!')
  }
}
