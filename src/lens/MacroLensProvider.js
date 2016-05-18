import { CodeLens, Range, Position } from 'vscode'
import * as reg from '../util/regexUtil'
// import * as fileUtil from '../util/fileUtil'

export default class MacroLensProvider {
  constructor (conf) {
    this._conf = conf
  }

  provideCodeLenses (doc, token) {
    const lines = doc.getText().split(reg.linesRegex)

    const result = []
    lines.forEach((e, i) => {
      const match = e.match(/<execute macro="(.+)"/)

      // TODO 获取整个macro块，并解析已经赋值的var列表，之后加入payload

      if (!match) return

      const range = new Range(new Position(i, 0), new Position(i, 99))
      const lens = new CodeLens(range)

      lens.payload = {segment: match[1]}

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
    const { segment } = codeLensItem.payload
    // TODO 根据macro获取该macro所需的var列表，根据payload排除已赋值的var
    // TODO use util method

    if (segment.indexOf('#') < 0) return undefined

    const [root, command] = segment.split('#')

    codeLensItem.command = {title: `root: ${root}, command: ${command}`,
      command: undefined,
    arguments: undefined}

    return codeLensItem
  }
}
