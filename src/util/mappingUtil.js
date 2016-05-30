import { Range, Position } from 'vscode'
import * as rd from 'rd'
import * as fs from 'fs'
import * as reg from './regexUtil'
import * as fileUtil from './fileUtil'

export const typeFilter = ['testcase', 'macro', 'path', 'function']

export const typeMapping = {
  testcase: 'testcase',
  macro: 'macro',
  function: 'function',
  locator1: 'path'
}

/* mapping
{ type: new Map([filename, {uri, name}]) }
*/
export const mapping = {
  testcase: new Map(),
  macro: new Map(),
  function: new Map(),
  path: new Map()
}

/* mappingWholeName
{ name1:.., name2:.., name3:.. }
*/
export const mappingWholeNames = {}

/* mappingCommandLine
{ fileName: new Map([commandName, range])}
*/
export const mappingCommandLine = {}

/* mappingLocator
{ fileName: new Map([locatorKey, locatorValue]) }
*/
export const mappingLocator = {}

/* mappingMacroVars
{ fileName: new Map([macroName, varsArray]) }
*/
export const mappingMacroVars = {}

export const initMapping = function (opts) {
  const {url} = opts

  return Promise.resolve(initMappingPO(url))
    .then(() => {
      // mapping locator
      initMappingLocator()

      // mapping vars
      initMappingMacroVars()

      // mapping command
      initMappingCommandLine('testcase')
      initMappingCommandLine('macro')
      initMappingCommandLine('function')
    })
}

const initMappingPO = (url) => {
  rd.eachSync(url, function (f, s) {
    if (s.isDirectory()) return

    const ext = fileUtil.getExtName(f)

    if (typeFilter.indexOf(ext) < 0) return

    const name = fileUtil.getFileName(f)
    const baseName = fileUtil.getBaseName(f)

    if (mapping[ext]) {
      mapping[ext].set(name, {uri: f, name: `${name}.${ext}`})
    }

    if (!mappingWholeNames[baseName]) mappingWholeNames[baseName] = f
  })
}

const initMappingLocator = function () {
  const pathSources = mapping.path

  for (const [name, file] of pathSources) {
    fs.readFile(file.uri, 'utf-8', (err, data) => {
      if (err) throw err

      const match = data.match(reg.locatorBlock)
      const mapArray = []

      if (match) {
        match.forEach((e, i) => {
          const locatorArray = []

          e.split(reg.linesRegex).forEach(e => {
            const match = e.match(reg.locatorLine)

            locatorArray.push(match ? match[1] : 'null')
          })

          mapArray.push(locatorArray)
        })

        mappingLocator[name] = new Map(mapArray)
      }
    })
  }
}

// TODO 增加一个var的mapping(DONE)
const initMappingMacroVars = function () {
  const pathSources = mapping.macro

  for (const [name, file] of pathSources) {
    fs.readFile(file.uri, 'utf-8', (err, data) => {
      if (err) throw err

      const lines = data.split(reg.linesRegex)
      const mapArray = []

      const $Names = []
      let segment = ''

      lines.forEach((e, i) => {
        const match = e.match(/command name="(\w+)"/)

        // clean the arr and init
        if (match) {
          $Names.splice(0, $Names.length)
          segment = match[1]
          return
        }

        // means one command balck end
        if (e.match(/<\/command>/)) {
          const temp = {}
          $Names.forEach(e => {
            e = e.slice(2, e.length - 1)

            if (!temp[e]) temp[e] = 1
          })

          mapArray.push([segment, Object.keys(temp)])
        }

        // retrive the ${...} segment
        const match$ = e.match(/\${([\w,]+)}/g)

        if (match$) Array.prototype.push.apply($Names, match$)
      })

      mappingMacroVars[name] = new Map(mapArray)
    })
  }
}

const initMappingCommandLine = function (type) {
  const _mapping = mapping[type]

  for (const [name, file] of _mapping) {
    fs.readFile(file.uri, 'utf-8', (err, data) => {
      if (err) throw err

      const lines = data.split(reg.linesRegex)
      const mapArray = []

      lines.forEach((e, i) => {
        const match = e.match(reg.commandRegexGroup)

        if (match) {
          const start = Math.max(0, match[0].match(reg.commandName).index - 1)
          const end = Math.max(0, match.index + match[1].length - 1)
          mapArray.push([match[1], {uri: file.uri, range: new Range(new Position(i, start), new Position(i, end))}])
        }
      })

      mappingCommandLine[name] = new Map(mapArray)
    })
  }
}
