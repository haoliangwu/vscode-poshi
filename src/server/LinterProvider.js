import * as fileUtil from '../util/fileUtil'
import * as general from './LinterGeneralRules'

export default class LinterProvider {
  doLinter (doc) {
    const diagnositics = []
    const rules = []
    const ext = fileUtil.getExtName(doc.uri)

    // general
    for (const rule in general) {
      rules.push(rule)
    }

    // by po type
    switch (ext) {
      case 'testcase':
        break
      case 'macro':
        break
      case 'function':
        break
      case 'path':
        break
    }

    rules.forEach(rule => {
      Array.prototype.push.apply(diagnositics, rule(doc))
    })

    return diagnositics
  }
}
