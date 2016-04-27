import * as fs from 'fs'
import * as path from 'path'

import { Position, Location, Uri, workspace } from 'vscode'
import { mapping } from '../util/mappingUtil'

export default class PeekFileDefinitionProvider {
  constructor (props) {
    this._conf = workspace.getConfiguration('poshi')
  }

  provideDefinition (document,
    position,
    token) {
    // todo: make this method operate async
    // let working_dir = path.dirname(document.fileName)
    const word = document.getText(document.getWordRangeAtPosition(position))
    const line = document.lineAt(position)

    // console.log('====== peek-file definition lookup ===========')
    console.log('word: ' + word)
    console.log('line: ' + line.text)
    console.log('mapping demo: ' + mapping.testcase.get('PGMessageboards'))

    // We are looking for strings with filenames
    // - simple hack for now we look for the string with our current word in it on our line
    //   and where our cursor position is inside the string
    let re_str = `"(.*?${word}.*?)"`
    let re_type = /\w+(?=\=)/
    let match = line.text.match(re_str)
    let type = line.text.match(re_type)[0]
    // console.log("   Match: ", match)

    if (match !== null) {
      let potential_fname = match[1]
      let root_fname = 'root'
      let command_name = 'command'
      let match_start = match.index
      let match_end = match.index + potential_fname.length
      let sep_index = potential_fname.indexOf('#')

      if (sep_index > 0) {
        sep_index += match.index
        root_fname = potential_fname.split('#')[0]
        command_name = potential_fname.split('#')[1]
      } else {
        root_fname = potential_fname
        command_name = potential_fname.toLowerCase()
      }

      // Verify the match string is at same location as cursor
      if (position.character >= match_start && position.character <= match_end) {
        let full_path = path.resolve(mapping[type].get(root_fname).uri)

        console.log(' Match: ', match)
        console.log(' Fname: ' + potential_fname)
        console.log(' Root Name: ' + root_fname)
        console.log(' Command Name: ' + command_name)
        console.log('  Full: ' + full_path)

        if (fs.existsSync(full_path)) {
          return workspace.openTextDocument(full_path)
            .then(doc => {
              if (position.character <= sep_index) {
                return new Location(Uri.file(full_path), new Position(0, 1))
              } else {
                const lines = doc.getText().split(/\r?\n/g)
                for (let i = 0; i < lines.length; i++) {
                  const index = lines[i].indexOf(`name="${command_name}"`)

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
