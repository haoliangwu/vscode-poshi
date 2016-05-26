import { workspace, window } from 'vscode'
import { mapping } from './util/mappingUtil'

export const quickPickCommand = () => {
  // TODO 加一些文件联想操作、模糊查询操作
  const quickPickOpts = {
    placeHolder: 'Choose one file to open shortly'
  }

  quickPickOpts.onDidSelectItem = () => {
    window.showInformationMessage(`quick pick list callback`)
  }

  const inputOpts = {
    placeHolder: 'eg:fileName#commandName',
    validateInput: (input) => {
      if (input.indexOf('#') < 0) return 'The input string should contian # mark.'

      const reg = /\w+#\w+/i

      if (!reg.test(input)) {
        return 'The input string is not valid.'
      }
    }
  }

  // window.showQuickPick(['foo', 'bar', 'baz'], quickPickOpts)

  const InputSending = window.showInputBox(inputOpts)

  // const quickPickPending = window.showQuickPick(mapping.testcase.get(input.split('#')[0]))

  InputSending.then(input => {
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
