import { CompletionItemKind } from 'vscode-languageserver'
import * as fs from 'fs'
import * as rd from 'rd'

import * as reg from '../util/regexUtil'
let sourceMapping = {}
let completionSource = []
let completionInfoSource = []
// let type = 'Type'

function init (settings) {
  const {liferay, project} = settings.poshi
  const url = liferay.home + project.home
  let counter = 0

  rd.each(url, function (f, s, next) {
    // TODO 根据type类型动态生成
    if (f.indexOf('.macro') > 0 || f.indexOf('.function') > 0) {
      const match = f.match(/(\w+)\.(\w+)/)
      // init url mapping
      sourceMapping[match[1]] = f

      // init completion source
      completionSource.push({
        label: match[1],
        kind: CompletionItemKind.Text,
        data: counter++
      })
    }

    next()
  }, function (err) {
    if (err) throw err
  })
}

function retriveCommandName (root) {
  console.log(sourceMapping[root])
  return new Promise((resolve, reject) => {
    fs.readFile(sourceMapping[root], 'utf-8', (err, data) => {
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

// debug
// const mockSettings = {
//   poshi: {
//     liferay: {
//       home: '/home/lyon/liferay/portal/portal-6210'
//     },
//     project: {
//       home: '/portal-web/test/functional/com/liferay/portalweb'
//     }
//   }
// }

// init(mockSettings)

// setTimeout(() => {
//   retriveCommandName('AddSelection')
//     .then(result => {
//       console.log(result)
//     })
// }, 2000)

export { init, completionSource, completionInfoSource, retriveCommandName }
