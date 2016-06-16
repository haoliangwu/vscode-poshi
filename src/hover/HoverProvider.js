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
    let word = document.getText(document.getWordRangeAtPosition(position))

    let curLine = position.line
    let curText = document.lineAt(position).text

    let re_str = `locator1="(.*?${word}.*?)"`
    let trigger = curText.match(re_str)

    if (!trigger) return null

    // the mapping key
    const match = curText.match(reg.locator1Group)
    const root = match ? match[1] : ''
    const key = match ? match[2] : ''

    if (!match) return null

    const match_start = match.index
    const match_end = match_start + match[0].length

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
  }
}
