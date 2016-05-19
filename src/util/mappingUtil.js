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
{fileName: [var0, var1, var2...]}
*/
export const mappingMacroVars = {}

export const initMapping = function (opts) {
  const {url} = opts

  Promise.resolve(initMappingPO(url))
    .then(() => {
      initMappingLocator()
    })
}

const initMappingPO = (url) => {
  rd.eachSync(url, function (f, s) {
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

        // const match = data.match(reg.locatorBlock)
        // const mapArray = []

        // if (match) {
        //   match.forEach((e, i) => {
        //     const locatorArray = []

        //     e.split(reg.linesRegex).forEach(e => {
        //       const match = e.match(reg.locatorLine)

        //       locatorArray.push(match ? match[1] : 'null')
        //     })

        //     mapArray.push(locatorArray)
        //   })

        //   res(new Map(mapArray))
        // }
        res([])
      })
    })).then(vars => {
      mappingMacroVars[name] = vars
    })
  }
}
