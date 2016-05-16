import * as path from 'path'

export const getWholeName = (uri) => {
  return path.basename(uri)
}

export const getExtName = (wholeName) => {
  return wholeName.split('.').pop()
}

export const getFileName = (wholeName) => {
  return wholeName.split('.').shift()
}

export const getChangeTextByCursor = (lineText, cursor) => {
  const reg = /\w+="[#(\w+)]*"/g
  const match = lineText.match(reg)
  let index = 0

  const segment = match.find(e => {
    index = lineText.indexOf(e)

    return cursor > index && cursor < (index + e.length)
  })

  if (segment) {
    index += segment.indexOf('"')

    return cursor > index ? segment : undefined
  }
}

export const parseIndexSyntaxSegment = (segment) => {
  if (segment.indexOf('#') < 0) return segment

  return segment.split('#')[0]
}
