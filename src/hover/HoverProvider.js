import { Hover, Range, Position } from 'vscode'
import * as reg from '../util/regexUtil'

import { mappingLocator } from '../util/mappingUtil'

export default class HoverProvider {
  constructor (conf) {
    this.conf = conf
  }

  get type () {
    return 'hover'
  }

  get selector () {
    return [
      {
        language: 'xml',
        scheme: 'file',
        pattern: '**/**.macro'
      },
      {
        language: 'xml',
        scheme: 'file',
        pattern: '**/**.testcase'
      }
    ]
  }

  provideHover (document, position, token) {
    // console.log('Document: ')
    // console.log(document)
    try {
      let word = document.getText(document.getWordRangeAtPosition(position))

      let curLine = position.line
      let curText = document.lineAt(position).text
      console.log(curText)
      let re_str = `locator1="(.*?${word}.*?)"`
      let trigger = curText.match('Current Line: ' + re_str)

      if (!trigger) return null
      // console.log('Trigger Text: ' + trigger[0])

      // console.log('Line: ')
      // console.log(line)

      // the mapping key
      const match = curText.match(reg.locator1Group)
      const root = match ? match[1] : ''
      const key = match ? match[2] : ''

      if (!match) return null

      const match_start = match.index
      const match_end = match_start + match[0].length
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

      const infoMap = mappingLocator[root]

      if (!infoMap) return null

      const info = infoMap.get(key)

      const message = info || 'No locator info'

      // TODO use template generator will be better
      const markdownText = `**${message}**`

      const range = new Range(
        new Position(curLine, match_start),
        new Position(curLine, match_end))

      return new Hover(markdownText, range)
    } catch (error) {
      console.log(error.stack)
    }
  }
}
