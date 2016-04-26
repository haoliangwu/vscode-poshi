import { CompletionItemKind } from 'vscode-languageserver'
import * as fs from 'fs'
import * as rd from 'rd'

import * as reg from '../util/regexUtil'

let completionSource = []
let completionInfoSource = []
let root = 'Root'
let type = 'Type'
let counter = 0

function init (url) {
  rd.each(url, function (f, s, next) {
    if (f.indexOf('.macro') > 0 || f.indexOf('.function') > 0) {
      const match = f.match(/(\w+)\.(\w+)/)

      root = match[1]
      type = match[2]

      fs.readFile(f, 'utf-8', (err, data) => {
        if (err) {
          console.log(err.stack)
        } else {
          retriveCommandName(data)
        }
      })
    }

    next()
  }, function (err) {
    if (err) throw err
  })
}

function retriveCommandName (data) {
  data.match(reg.commandRegex)
    .map((e) => {
      return e.match(reg.commandName)[1]
    })
    .forEach((e) => {
      completionSource.push({
        label: `${root}#${e}`,
        kink: CompletionItemKind.Text,
        data: ++counter
      })

      completionInfoSource.push({
        detail: e,
        documentation: `The ${e} block of ${root} ${type}.`
      })
    })
}

init('/home/lyon/liferay/portal/portal-6210/portal-web/test/functional/com/liferay/portalweb')

setTimeout(() => {
  console.log(completionSource)
}, 2000)

export { completionSource, completionInfoSource }
