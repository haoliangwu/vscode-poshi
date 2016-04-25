import { CompletionItemKind } from 'vscode-languageserver'
import * as fs from 'fs'

const reg = require('../util/regexUtil')

let completionSource = []
let completionInfoSource = []
let root = 'Calendar'
let type = 'Macro'

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
        label: `${root}#${e}`,
        kink: CompletionItemKind.Text,
        data: i + 1
      })

      completionInfoSource.push({
        detail: e,
        documentation: `The ${e} block of ${root} ${type}.`
      })
    })
}

init()

export { completionSource, completionInfoSource }
