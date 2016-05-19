import * as fs from 'fs'
import * as path from 'path'

import { Position, Location, Uri, workspace } from 'vscode'
import * as reg from '../util/regexUtil'
import { mapping, typeMapping } from '../util/mappingUtil'

export default class PeekFileDefinitionProvider {
  constructor (props) {
    this._conf = workspace.getConfiguration('poshi')
  }

  get type () {
    return 'definition'
  }

  get selector () {
    return {
      language: 'xml',
      scheme: 'file'
    }
  }

  provideDefinition (document,
    position,
    token) {
    // todo: make this method operate async
    // let working_dir = path.dirname(document.fileName)
    const word = document.getText(document.getWordRangeAtPosition(position))
    const line = document.lineAt(position)

    console.log('====== peek-file definition lookup ===========')
    console.log('word: ' + word)
    console.log('line: ' + line.text)

    // We are looking for strings with filenames
    // - simple hack for now we look for the string with our current word in it on our line
    //   and where our cursor position is inside the string
    let reg_str = '(\\w+)="(\\S*?' + word + '\\S*?)"'
    let match = line.text.match(reg_str)
    console.log('   Match: ', match)

    if (match) {
      let type = match[1]

      const potential_fname = match[2]
      const match_start = match.index + type.length + 2
      const match_end = match_start + potential_fname.length

      console.log(position.character, match_start, match_end)

      let root_fname = 'root'
      let command_name = 'command'
      let sep_index = potential_fname.indexOf('#')

      if (sep_index > 0) {
        sep_index += match.index
        root_fname = potential_fname.split('#')[0]
        command_name = potential_fname.split('#')[1]
      } else {
        root_fname = potential_fname
        command_name = potential_fname.toLowerCase()
      }

      console.log(' Fname: ' + potential_fname)
      console.log(' Root Name: ' + root_fname)
      console.log(' Command Name: ' + command_name)

      // type mapping, bind locator1 to .path
      type = typeMapping[type]

      // Verify the match string is at same location as cursor
      if (position.character >= match_start && position.character <= match_end) {
        let full_path = path.resolve(mapping[type].get(root_fname).uri)
        console.log(full_path)

        console.log(' Full: ' + full_path)

        if (fs.existsSync(full_path)) {
          return workspace.openTextDocument(full_path)
            .then(doc => {
              if (position.character <= sep_index) {
                return new Location(Uri.file(full_path), new Position(0, 1))
              } else {
                const lines = doc.getText().split(reg.linesRegex)
                for (let i = 0; i < lines.length; i++) {
                  // `name="${command_name}"`
                  const index = lines[i].indexOf(reg.nameMappingByType(type, command_name))

                  if (index > 0) {
                    return new Location(Uri.file(full_path), new Position(i, index))
                  }
                }
                return new Location(Uri.file(full_path), new Position(0, 1))
              }
            })
        }
      }
    }

    return null
  }
}
