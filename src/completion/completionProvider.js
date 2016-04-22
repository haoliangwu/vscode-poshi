import { CompletionItemKind } from 'vscode-languageserver'
import * as fs from 'fs'

const reg = require('../util/regexUtil')

let completionSource = []

function init () {
  fs.readFile('../../test/source/Calendar.macro', 'utf-8', (err, data) => {
    if (err) {
      console.log(err.stack)
    } else {
      retriveCommandName(data)
    }
  })
}

function retriveCommandName (data) {
  data.match(reg.commandRegex)
    .map((e) => {
      return e.match(reg.commandName)[0]
    })
    .forEach((e, i) => {
      completionSource.push({
        label: `Calendar#${e}`,
        kink: CompletionItemKind.Text,
        data: i + 1
      })
    })
}

init()

export { completionSource }

export const completionInfoSource = [
  {
    detail: 'TypeScript details',
    documentation: 'TypeScript documentation'
  },
  {
    detail: 'TypeScript details',
    documentation: 'TypeScript documentation'
  }
]
