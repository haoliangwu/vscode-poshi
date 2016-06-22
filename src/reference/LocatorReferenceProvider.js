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

  provideReferences (doc, position, context, token) {
    const text = doc.lineAt(position).text

    const match = text.match(/<td>([A-Z0-9_]*)<\/td>/)

    if (!match) return

    return []
  }
}
