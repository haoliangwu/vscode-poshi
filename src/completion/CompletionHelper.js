import * as reg from '../util/regexUtil'

export const eachCommandSegments = (text, cb) => {
  text.match(reg.commandRegex)
    .map(e => {
      return e.match(reg.commandName)[1]
    })
    .forEach(cb)
}

export const eachLocatorSegments = (text, cb) => {
  text.match(reg.locatorBlock)
    .map(e => {
      const locatorArray = []

      e.split(reg.linesRegex).forEach(e => {
        const match = e.match(reg.locatorLine)

        locatorArray.push(match ? match[1] : 'null')
      })

      return locatorArray
    })
    .forEach(cb)
}
