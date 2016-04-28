import { workspace, Hover } from 'vscode'
import * as reg from '../util/regexUtil'

import { initMappingLocator } from '../util/mappingUtil'

export default class HoverProvider {
  constructor (props) {
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
      const match = curText.match(reg.locator1Group)
      const root = match ? match[1] : ''
      const key = match ? match[2] : ''
      console.log('HoverKEY: ' + match[0])
      console.log('Root: ' + root)
      console.log('Locator Key: ' + key)

      // get the hover in which command block
      //   let commandBlock = ''

      //   while (true) {
      //     const match = curText.match(reg.commandRegexGroup)
      //     if (match || curLine === 0) {
      //       commandBlock = match[1]
      //       break
      //     } else {
      //       curLine--
      //       line = document.lineAt(curLine)
      //       curText = line.text
      //     }
      //   }
      //   console.log('Command Block: ' + commandBlock)
      //   const info = mappingLocator[root].get(key)
      console.log(initMappingLocator)

      return new Hover('info')
    } catch (error) {
      console.log(error.stack)
    }
  }
}
