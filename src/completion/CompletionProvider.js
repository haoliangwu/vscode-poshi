import { CompletionItemKind } from 'vscode-languageserver'
import * as fs from 'fs'
import * as rd from 'rd'

import * as reg from '../util/regexUtil'
import * as fileUtil from '../util/fileUtil'
import { typeMapping } from '../util/mappingUtil'

const filter = ['testcase', 'macro', 'path', 'function']

const sourceMapping = {
  'testcase': new Map(),
  'macro': new Map(),
  'function': new Map(),
  'path': new Map()
}

const completionMapping = {
  'testcase': [],
  'macro': [],
  'function': [],
  'path': []
}

// let type = 'Type'

function init (settings) {
  const {liferay, project} = settings.poshi
  const url = liferay.home + project.home
  let counter = 0

  rd.each(url, function (f, s, next) {
    // TODO 根据type类型动态生成(DONE)
    const wholeName = fileUtil.getWholeName(f)
    const ext = fileUtil.getExtName(wholeName)
    const name = fileUtil.getFileName(wholeName)

    if (filter.indexOf(ext) > 0) {
      sourceMapping[ext].set(name, f)

      completionMapping[ext].push({
        label: name,
        kind: CompletionItemKind.Text,
        data: ++counter,
        detail: `${ext}`
      })
    }

    next()
  }, function (err) {
    if (err) throw err
  })
}

function retriveCommandName (match, connection) {
  const type = typeMapping[match.split('=')[0]]
  const segment = match.split('=')[1].replace(/"/g, '')

  connection.console.log('Segment: ' + segment)

  const key = fileUtil.parseIndexSyntaxSegment(segment)

  // connection.console.log(segment)
  connection.console.log('KEY: ' + key)

  return new Promise((resolve, reject) => {
    // the type is not po type
    if (!sourceMapping[type]) resolve([])

    // the key is undefined or null
    if (!key) resolve(completionMapping[type])

    const uri = sourceMapping[type].get(key)
    // uri is undefined, the mapping didn't exist
    if (!uri) resolve(completionMapping[type])

    fs.readFile(uri, 'utf-8', (err, data) => {
      let counter = 0
      let result = []
      if (err) reject(err)
      // get all command segments, for testcase, macro, function
      if (type !== 'path') {
        data.match(reg.commandRegex)
          .map(e => {
            return e.match(reg.commandName)[1]
          })
          .forEach(e => {
            result.push({
              label: `${e}`,
              kind: CompletionItemKind.Text,
              data: ++counter,
              detail: 'command'
            })
          })
      } else {
        data.match(reg.locatorBlock)
          .map(e => {
            const locatorArray = []

            e.split(reg.linesRegex).forEach(e => {
              const match = e.match(reg.locatorLine)

              locatorArray.push(match ? match[1] : 'null')
            })

            return locatorArray
          })
          .forEach(e => {
            result.push({
              label: `${e[0]}`,
              kind: CompletionItemKind.Text,
              data: ++counter,
              detail: 'locator',
              documentation: `${e[1]}`
            })
          })
      // get all locator value segments, for path
      // TODO resolve the extends issue in Path PO
      // TODO implement util class for split locator segments(Pending)
      }

      resolve(result)
    })
  })
}

export { init, completionMapping, retriveCommandName }
