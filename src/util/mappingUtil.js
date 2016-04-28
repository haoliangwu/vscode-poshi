import * as rd from 'rd'
import * as fs from 'fs'
import * as reg from './regexUtil'

export const mapping = {
  testcase: new Map(),
  macro: new Map(),
  function: new Map(),
  path: new Map()
}

export const mappingVar = {
  macro: new Map()
}

/* mappingLocator
{ fileName: new Map() }
*/
export const mappingLocator = {}

export const initMapping = function (url) {
  rd.each(url, function (f, s, next) {
    const match = f.match(/(\w+)\.(\w+)/)

    if (match !== null) {
      const [wholeName, name, type] = match

      if (mapping[type]) {
        mapping[type].set(name, {uri: f, name: wholeName})
      }
    }

    next()
  }, function (err) {
    if (err) throw err
  })
}

// TODO
export const initMappingVar = function () {
  const macroMaps = mapping.macro

  for (const [k, v] of macroMaps) {
    const _namespace = k
    const result = {}
    // console.log(v)

    fs.readFile(v.uri, 'utf-8', (err, data) => {
      if (err) throw err

      // get block mapping
      const blockMapping = {}
      data.split(reg.executeBlock).forEach(block => {
        const lines = block.split(reg.linesRegex)

        // get var mapping
        lines.forEach((e, i) => {
          /* TODO 需要修改正则，达到匹配所有以${}引用的片段
              之后生成一个需要参数的数组
              然后在所有调用macro的execute语句中，hover会提示基于参数信息
              格式：
              result={
                  command1: [arg1,arg2,arg3...],
                  command2: [arg1,arg2,arg3...],
                  ...
              }
          */

          const match = e.match(reg._varLineRegex)

          if (match) {
            // console.log(match[0])
            const _varName = match[0].match(reg.nameRegexGroup)
            // console.log(_varName[1])
            const _varValue = match[0].match(reg.valueRegexGroup)
            // if (!_varValue)
            //   console.log(match[0])

            // add var mapping
            if (_varName && _varValue) blockMapping[_varName[1]] = _varValue[1]
          }
        })
      })
    })

    // TODO 实现其他的文件类型
    mappingVar.macro.set(_namespace, result)
  }
}

export const initMappingLocator = function () {
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
