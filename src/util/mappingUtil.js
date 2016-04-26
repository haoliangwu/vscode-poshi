import * as rd from 'rd'

export const mapping = {
  testcase: new Map(),
  macro: new Map(),
  function: new Map(),
  path: new Map()

}

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
