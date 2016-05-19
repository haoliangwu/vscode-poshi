import { CodeLens, Range, Position } from 'vscode'
import * as path from 'path'
import { workspace } from 'vscode'

import * as reg from '../util/regexUtil'
import { mapping } from '../util/mappingUtil'

export default class MacroLensProvider {
  constructor (conf) {
    this.conf = conf
  }

  get type () {
    return 'lens'
  }

  get selector () {
    return [
      {
        language: 'xml',
        scheme: 'file',
        pattern: '**/**.testcase'
      },
      {
        language: 'xml',
        scheme: 'file',
        pattern: '**/**.macro'
      }
    ]
  }

  provideCodeLenses (doc, token) {
    const lines = doc.getText().split(reg.linesRegex)

    const result = []
    lines.forEach((e, i) => {
      let currentLine = i
      const match = e.match(/<execute macro="(.+)"/)

      if (!match) return
      // TODO 获取整个macro块，并解析已经赋值的var列表，之后加入payload(DONE)

      const varNames = []

      while (true) {
        if (e.match(/<execute macro="(.+)" \/>/)) break

        const line = doc.lineAt(++currentLine).text

        if (line.match(/<\/execute>/)) {
          break
        }

        const match = line.match(/<var name="(\w+)"/)

        if (match) varNames.push(match[1])
      }

      const range = new Range(new Position(i, 0), new Position(i, 99))
      const lens = new CodeLens(range)

      lens.payload = {segment: match[1], vars: varNames}

      result.push(lens)
    })

    // const range = new Range(new Position(0, 0), new Position(0, 1))
    // const lens = new CodeLens(range)

    // lens.command = {
    //   title: `Just Demo`,
    //   command: undefined,
    //   arguments: undefined
    // }

    return Promise.resolve(result)
  }

  resolveCodeLens (codeLensItem, token) {
    const { segment, vars } = codeLensItem.payload
    // TODO 根据macro获取该macro所需的var列表，根据payload排除已赋值的var
    // TODO use util method

    if (segment.indexOf('#') < 0) return

    const [root, command] = segment.split('#')
    const full_path = path.resolve(mapping['macro'].get(root).uri)

    return workspace.openTextDocument(full_path)
      .then(doc => {
        let title = ''

        vars.forEach(e => {
          title += e + ' '
        })

        if (title.length === 0) title = 'No Need to set any vars'

        codeLensItem.command = {title,
          command: undefined,
        arguments: undefined}

        return codeLensItem
      })
  }
}
