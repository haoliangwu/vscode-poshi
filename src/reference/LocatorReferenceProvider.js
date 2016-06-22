// import { Location } from 'vscode'

export default class LocatorReferenceProvider {
  constructor (conf) {
    this._conf = conf
  }

  get type () {
    return 'reference'
  }

  get selector () {
    return {
      language: 'xml',
      scheme: 'file',
      pattern: '**/**.path'
    }
  }

  provideReferences (document, position, context, token) {
    return []
  }
}
