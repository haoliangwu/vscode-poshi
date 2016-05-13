import { CompletionItemKind } from 'vscode-languageserver'
import * as fs from 'fs'
import * as rd from 'rd'

import * as reg from '../util/regexUtil'
import * as fileUtil from '../util/fileUtil'

const filter = ['testcase', 'macro', 'path', 'function']

let sourceMapping = {
  'testcase': new Map(),
  'macro': new Map(),
  'function': new Map(),
  'path': new Map()
}
let completionSource = []
let completionInfoSource = []
// let type = 'Type'

function init (settings) {
  const {liferay, project} = settings.poshi
  const url = liferay.home + project.home
  let counter = 0

  rd.each(url, function (f, s, next) {
    // TODO 根据type类型动态生成
    const wholeName = fileUtil.getWholeName(f)
    const ext = fileUtil.getExtName(wholeName)
    const name = fileUtil.getFileName(wholeName)

    if (filter.indexOf(ext)) {
      sourceMapping[ext].set(name, f)

      completionSource.push({
        label: name,
        kind: CompletionItemKind.Text,
        data: ++counter
      })
    }

    // switch (ext) {
    //   case 'testcase':
    //     break
    //   case 'macro':
    //     break
    //   case 'function':
    //     break
    //   case 'path':
    //     break
    //   default:
    //     break
    // }

    next()
  }, function (err) {
    if (err) throw err
  })
}

function retriveCommandName (type, root) {
  return new Promise((resolve, reject) => {
    if (!sourceMapping[type]) resolve([])

    const uri = sourceMapping[type].get(root)

    fs.readFile(uri, 'utf-8', (err, data) => {
      let counter = 0
      let result = []
      if (err) reject(err)
      // get all command segments
      data.match(reg.commandRegex)
        .map((e) => {
          return e.match(reg.commandName)[1]
        })
        .forEach((e) => {
          result.push({
            label: `${e}`,
            kind: CompletionItemKind.Text,
            data: ++counter
          })
        })

      resolve(result)
    })
  })
}

export { init, completionSource, completionInfoSource, retriveCommandName }
