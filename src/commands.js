import { workspace, window } from 'vscode'
import { mapping } from './util/mappingUtil'

export const quickPickCommand = () => {
  const inputOpts = {
    placeHolder: 'eg:testcaseName#commandName',
    validateInput: function (input) {
      if (input.indexOf('#') < 0) return 'The input string should contian # mark.'

      const reg = /\w+#\w+/i

      if (!reg.test(input)) {
        return 'The input string is not valid.'
      }
    }
  }

  const pending = window.showInputBox(inputOpts)

  pending.then(input => {
    if (!input) return

    const {uri} = mapping.testcase.get(input.split('#')[0])

    if (uri) {
      workspace.openTextDocument(uri).then(doc => {
        window.showTextDocument(doc)
      })
    } else window.showInformationMessage(`Cannot quick pick file by this testcase name.`)
  })
}

// // preview log
//     commands.registerCommand('POSHI.previewlog', () => {
//       commands.executeCommand(
//         'vscode.previewHtml',
//         Uri.file('/home/lyon/liferay/portal/portal-6210/portal-web/test-results/ApplicationdisplaytemplatesUsecase_ADTWiki/index.html')
//       )
//     })
