import { CodeLens, Range, Position } from 'vscode'

import * as reg from '../util/regexUtil'
import { mappingMacroVars } from '../util/mappingUtil'

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
    const varNames = []
    let lensLine = 0
    let segment = ''

    lines.forEach((e, i) => {
      if (e.match(/<execute macro="(\w+#\w+)" \/>/)) return

      const match = e.match(/<execute macro="(\w+#\w+)">/)

      if (match) {
        // clean the arr and init
        varNames.splice(0, varNames.length)
        lensLine = i
        segment = match[1]

        return
      }

      if (e.match(/<\/execute>/)) {
        // means one macro block end
        const range = new Range(new Position(lensLine, 0), new Position(lensLine, 99))
        const lens = new CodeLens(range)

        if (lensLine === 0 && varNames.length === 0) return

        lens.payload = {segment: segment, vars: [].concat(varNames)}

        result.push(lens)

        return
      }

      // retrive the var segment
      const matchVar = e.match(/<var name="(\w+)"/)

      if (matchVar) varNames.push(matchVar[1])

    // TODO 获取整个macro块，并解析已经赋值的var列表，之后加入payload(DONE)
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
    // TODO 根据macro获取该macro所需的var列表，根据payload排除已赋值的var(DONE)
    // TODO use util method

    if (segment.indexOf('#') < 0) return

    const [root, command] = segment.split('#')

    const varsList = mappingMacroVars[root].get(command)

    let title = ''

    varsList.forEach(e => {
      if (vars.includes(e)) return

      title += e + ' '
    })

    if (title.length === 0) title = 'No need to declare any vars'

    codeLensItem.command = {title,
      command: undefined,
    arguments: undefined}

    return codeLensItem
  }
}
