import * as path from 'path'

export const getBaseName = (uri) => {
  return path.basename(uri)
}

export const getExtName = (uri) => {
  return path.basename(uri).split('.').pop()
}

export const getFileName = (uri) => {
  return path.parse(uri).name
}

export const getChangeTextByCursor = (lineText, cursor) => {
  const reg = /\w+="[#(\w+)]*"/g
  const match = lineText.match(reg)

  if (!match) return undefined

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
  if (segment.indexOf('#') > 0) return segment.split('#')[0]
}
// TODO 整理方法类，按功能，比如操作文件名字，parser等等
