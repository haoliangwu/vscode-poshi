import * as fileUtil from '../util/fileUtil'
import * as helper from './LinterHelper'

export default class LinterProvider {
  doLinter (doc) {
    const diagnositics = []
    const ext = fileUtil.getExtName(doc.uri)

    switch (ext) {
      case 'testcase':
        helper.validateCommand(doc, diagnositics)
        break
      case 'macro':
        break
      case 'function':
        break
      case 'path':
        break
    }

    return diagnositics
  }

}
