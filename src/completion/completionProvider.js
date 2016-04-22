import { CompletionItemKind } from 'vscode-languageserver'
import * as fs from 'fs'

const reg = require('../util/regexUtil')

function init () {
  fs.readFile('../../test/source/Calendar.macro', 'utf-8', (err, data) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(retriveCommand(data))
    }
  })
}

function retriveCommand (data) {
  console.log(reg.commandRegex)
}

init()

export const completionSource = [
  {
    label: 'TypeScript',
    kind: CompletionItemKind.Text,
    data: 1
  },
  {
    label: 'JavaScript',
    kind: CompletionItemKind.Text,
    data: 2
  }
]

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
