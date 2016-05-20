import * as rd from 'rd'
import * as fs from 'fs'
import * as reg from './regexUtil'
import * as fileUtil from './fileUtil'

export const typeMapping = {
  testcase: 'testcase',
  macro: 'macro',
  function: 'function',
  locator1: 'path'
}

export const mapping = {
  testcase: new Map(),
  macro: new Map(),
  function: new Map(),
  path: new Map()
}

/* mappingLocator
{ fileName: new Map() }
*/
export const mappingLocator = {}
/* mappingMacroVars
{fileName: new Map()}
*/
export const mappingMacroVars = {}

export const initMapping = function (opts) {
  const {url} = opts

  Promise.resolve(initMappingPO(url))
    .then(() => {
      initMappingLocator()
      initMappingMacroVars()
    })
}

const initMappingPO = (url) => {
  rd.eachSync(url, function (f, s) {
    if (s.isDirectory()) return

    const ext = fileUtil.getExtName(f)
    const name = fileUtil.getFileName(f)

    if (mapping[ext]) {
      mapping[ext].set(name, {uri: f, name: `${name}.${ext}`})
    }
  })
}

const initMappingLocator = function () {
  const pathSources = mapping.path
  const promises = []

  for (const [name, file] of pathSources) {
    promises.push(new Promise((res, rej) => {
      fs.readFile(file.uri, 'utf-8', (err, data) => {
        if (err) rej(err)

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

          res(new Map(mapArray))
        }
      })
    }).then(map => {
      mappingLocator[name] = map
    }))
  }
}

// TODO 增加一个var的mapping
const initMappingMacroVars = function () {
  const pathSources = mapping.macro
  const promises = []

  for (const [name, file] of pathSources) {
    promises.push(new Promise((res, rej) => {
      fs.readFile(file.uri, 'utf-8', (err, data) => {
        if (err) rej(err)

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

        res(new Map(mapArray))
      })
    }).then(vars => {
      mappingMacroVars[name] = vars
    }))
  }
}
