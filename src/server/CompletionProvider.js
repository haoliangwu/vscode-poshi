import { CompletionItemKind } from 'vscode-languageserver'

import * as fs from 'fs'
import * as rd from 'rd'

import * as fileUtil from '../util/fileUtil'
import { typeMapping } from '../util/mappingUtil'

import * as helper from './CompletionHelper'

export default class CompletionProvider {
  constructor () {
    this.filter = ['testcase', 'macro', 'path', 'function']
    this.sourceMapping = {
      'testcase': new Map(),
      'macro': new Map(),
      'function': new Map(),
      'path': new Map()
    }

    this.completionMapping = {
      'testcase': [],
      'macro': [],
      'function': [],
      'path': []
    }
  }

  init (conf, connection) {
    const {liferay, project} = conf.poshi
    const url = liferay.home + project.home

    let counter = 0

    rd.each(url, (f, s, next) => {
      // TODO 根据type类型动态生成(DONE)
      const ext = fileUtil.getExtName(f)
      const name = fileUtil.getFileName(f)

      if (this.filter.indexOf(ext) > 0) {
        this.sourceMapping[ext].set(name, f)

        this.completionMapping[ext].push({
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

  retriveCommandName (match, connection) {
    const type = typeMapping[match.split('=')[0]]
    const sourceMap = this.sourceMapping[type]
    connection.console.log(sourceMap)
    const segment = match.split('=')[1].replace(/"/g, '')

    // the type is not po type
    if (!sourceMap) return Promise.resolve([])

    // the key is undefined or null
    const key = fileUtil.parseIndexSyntaxSegment(segment)
    if (!key) return Promise.resolve(this.completionMapping[type])

    // uri is undefined, the mapping didn't exist
    const uri = sourceMap.get(key)
    if (!uri) return Promise.resolve(this.completionMapping[type])

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
}
