import { Location, Range, Position, Uri } from 'vscode'
import * as fileUtil from '../util/fileUtil'
import * as fse from 'fs-extra'
import * as path from 'path'
import { mapping } from '../util/mappingUtil'

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

    const locations = []

    try {
      const segment = path.resolve(__dirname, `../../metrics/reference/locators/${fileUtil.getFileName(doc.uri.fsPath)}#${match[1]}.json`)

      const references = fse.readJsonSync(segment, {throws: false})

      if (references === null) return []

      for (const fileName in references) {
        const [baseName, ext] = fileName.split('.')
        const reference = references[fileName]

        const uri = Uri.file(mapping[ext].get(baseName).uri)

        reference.forEach(position => {
          const {line, start, end} = position
          const range = new Range(new Position(line, start), new Position(line, end))

          locations.push(new Location(uri, range))
        })
      }

      return locations
    } catch (error) {
      console.log(error)
    }
  }
}
