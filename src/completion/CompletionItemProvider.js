import * as fs from 'fs'
import * as path from 'path'

import { CompletionItem } from 'vscode'
import * as fileUtil from '../util/fileUtil'
// import { mapping, typeMapping } from '../util/mappingUtil'

const DefinedAttrs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../metrics/definedAttrs.json'), 'utf-8'))
const DefinedTags = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../metrics/definedTags.json'), 'utf-8'))

export default class CompletionItemProvider {
  constructor (conf) {
    this._conf = conf
  }

  get type () {
    return 'completion'
  }

  get selector () {
    return {
      language: 'xml',
      scheme: 'file'
    }
  }

  // TODO 分离completion feature
  provideCompletionItems (doc, position, token) {
    const itemsList = []
    const line = doc.lineAt(position).text
    const match = fileUtil.getChangeTextByCursor(line, position.character)

    if (!match) {
      // attr completion
      Object.keys(DefinedAttrs).forEach(e => {
        itemsList.push(new CompletionItem(e))
      })

      // tag completion
      Object.keys(DefinedTags).forEach(e => {
        itemsList.push(new CompletionItem(e))
      })
    }

    return itemsList
  }

  resolveCompletionItem (item, token) {
    return item
  }
}
