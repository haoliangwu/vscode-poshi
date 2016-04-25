import * as fs from 'fs'
import * as path from 'path'

import { Position, Location, Uri, workspace } from 'vscode'

export default class PeekFileDefinitionProvider {

  provideDefinition (document,
    position,
    token) {
    // todo: make this method operate async
    let working_dir = path.dirname(document.fileName)
    let word = document.getText(document.getWordRangeAtPosition(position))
    let line = document.lineAt(position)

    // console.log('====== peek-file definition lookup ===========')
    console.log('word: ' + word)
    console.log('line: ' + line.text)

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
      let root_fname = potential_fname.split('#')[0]
      let command_name = potential_fname.split('#')[1]
      let match_start = match.index
      let sep_index = match.index + potential_fname.indexOf('#')
      let match_end = match.index + potential_fname.length

      // Verify the match string is at same location as cursor
      if (position.character >= match_start && position.character <= match_end) {
        let full_path = path.resolve(working_dir, `${root_fname}.${type}`)

        console.log(' Match: ', match)
        console.log(' Fname: ' + potential_fname)
        console.log(' Root Name: ' + potential_fname.split('#')[0])
        console.log(' Command Name: ' + potential_fname.split('#')[1])
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
