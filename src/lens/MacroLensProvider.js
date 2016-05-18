import { CodeLens, Range, Position } from 'vscode'
import * as reg from '../util/regexUtil'

export default class MacroLensProvider {
  constructor (conf) {
    this._conf = conf
  }

  provideCodeLenses (doc, token) {
    const lines = doc.getText().split(reg.linesRegex)

    const result = []
    lines.forEach((e, i) => {
      const match = e.match(/<execute macro=".+"/)

      if (!match) return

      console.log(e)
      const range = new Range(new Position(i), new Position(i))
      console.log(range)
      const lens = new CodeLens(range,
        {title: `Just Demo`,
          command: undefined,
        arguments: undefined})

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
    return Promise.resolve([ codeLensItem ])
  }
}
