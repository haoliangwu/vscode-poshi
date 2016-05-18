const PEEK_FILTER = [
  {
    language: 'xml',
    scheme: 'file'
  }
]

const SYMBOL_FILTER = [
  {
    language: 'xml',
    scheme: 'file'
  }
]

const HOVER_FILTER = [
  {
    language: 'xml',
    scheme: 'file',
    pattern: '**/**.macro'
  }
]

const MACRO_LENS_FILTER = [
  {
    language: 'xml',
    scheme: 'file',
    pattern: '**/**.testcase'
  },
  {
    language: 'xml',
    scheme: 'file',
    pattern: '**/**.macro'
  }
]

export { PEEK_FILTER, SYMBOL_FILTER, HOVER_FILTER, MACRO_LENS_FILTER }
