import * as fileUtil from '../util/fileUtil'
import * as _general from './LinterGeneralRules'
import * as _testcase from './LinterTestcaseRules'
import * as _macro from './LinterMacroRules'

import * as reg from '../util/regexUtil'

export default class LinterProvider {
  doLinter (doc) {
    const diagnositics = []
    const rules = []
    const ext = fileUtil.getExtName(doc.uri)
    const lines = doc.getText().split(reg.linesRegex)

    // _general
    if (ext !== 'path') {
      for (const rule in _general) {
        rules.push(_general[rule])
      }
    }

    // by po type
    switch (ext) {
      case 'testcase':
        for (const rule in _testcase) {
          rules.push(_testcase[rule])
        }
        break
      case 'macro':
        for (const rule in _macro) {
          rules.push(_macro[rule])
        }
        break
      case 'function':
        break
      case 'path':
        break
    }

    // do linter
    rules.forEach(rule => {
      rule(lines, diagnositics, this._connection)
    })

    return diagnositics
  }
}
