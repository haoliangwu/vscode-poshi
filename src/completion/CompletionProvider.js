import { CompletionItemKind } from 'vscode-languageserver'
import * as fs from 'fs'
import * as rd from 'rd'

import * as fileUtil from '../util/fileUtil'
import { typeMapping } from '../util/mappingUtil'

import * as helper from './CompletionHelper'

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

function init (settings) {
  const {liferay, project} = settings.poshi
  const url = liferay.home + project.home
  let counter = 0

  rd.each(url, (f, s, next) => {
    // TODO 根据type类型动态生成(DONE)
    const ext = fileUtil.getExtName(f)
    const name = fileUtil.getFileName(f)

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
  }, err => {
    if (err) throw err
  })
}

function retriveCommandName (match, connection) {
  const type = typeMapping[match.split('=')[0]]
  const segment = match.split('=')[1].replace(/"/g, '')

  // the type is not po type
  if (!sourceMapping[type]) return Promise.resolve([])

  // the key is undefined or null
  const key = fileUtil.parseIndexSyntaxSegment(segment)
  if (!key) return Promise.resolve(completionMapping[type])

  // uri is undefined, the mapping didn't exist
  const uri = sourceMapping[type].get(key)
  if (!uri) return Promise.resolve(completionMapping[type])

  return new Promise((resolve, reject) => {
    fs.readFile(uri, 'utf-8', (err, data) => {
      if (err) reject(err)

      let counter = 0
      let result = []
      // get all command segments, for testcase, macro, function
      if (type !== 'path') {
        helper.parseCommandSegments(data)
          .forEach(e => {
            result.push({
              label: `${e}`,
              kind: CompletionItemKind.Text,
              data: ++counter,
              detail: 'command'
            })
          })
      } else {
        // get all locator value segments, for path
        // TODO resolve the extends issue in Path PO
        // TODO implement util class for split locator segments(DONE)
        helper.parseLocatorSegments(data)
          .forEach(e => {
            result.push({
              label: `${e[0]}`,
              kind: CompletionItemKind.Text,
              data: ++counter,
              detail: 'locator',
              documentation: `${e[1]}`
            })
          })
      }

      resolve(result)
    })
  })
}

export { init, completionMapping, retriveCommandName }
