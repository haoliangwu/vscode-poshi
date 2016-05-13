export const getWholeName = (uri) => {
  return uri.split('/').pop()
}

export const getExtName = (wholeName) => {
  return wholeName.split('.').pop()
}

export const getFileName = (wholeName) => {
  return wholeName.split('.').shift()
}
