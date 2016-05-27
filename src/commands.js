import { workspace, window } from 'vscode'
import { mapping, mappingWholeNames } from './util/mappingUtil'

export const quickPickCommand = () => {
  // TODO 加一些文件联想操作、模糊查询操作(DONE)
  const quickPickOpts = {
    placeHolder: 'Fuzzy search for all POSHI source files'
  }

  // quickPickOpts.onDidSelectItem = (item) => {
  //   workspace.openTextDocument(mappingWholeNames[item]).then(doc => {
  //     window.showTextDocument(doc)
  //   })
  // }

  const quickPickOptionsList = Object.keys(mappingWholeNames)

  const quickPickPending = window.showQuickPick(quickPickOptionsList, quickPickOpts)

  quickPickPending.then(select => {
    const uri = mappingWholeNames[select]

    if (!uri) return undefined

    workspace.openTextDocument(uri).then(doc => {
      window.showTextDocument(doc)
    })
  })
}

export const quickOpenCommand = () => {
  // TODO 改为更通用的命令，可以打开所有的PO对象
  const inputOpts = {
    placeHolder: 'eg:fileName#commandName',
    validateInput: (input) => {
      if (input.indexOf('#') < 0) {
        return 'The input should contain "#" mark'
      }

      const reg = /\w+#\w+/i

      if (!reg.test(input)) {
        return 'The input string is not valid.'
      }
    },
    prompt: 'Press enter or continue type to process fuzzy query'
  }

  const InputSending = window.showInputBox(inputOpts)

  InputSending.then(input => {
    if (!input) return

    if (input.indexOf('#') < 0) {
    } else {
      const {uri} = mapping.testcase.get(input.split('#')[0])

      if (uri) {
        workspace.openTextDocument(uri).then(doc => {
          window.showTextDocument(doc)
        })
      } else window.showInformationMessage(`Cannot quick pick file by this testcase name.`)
    }
  })
}

// // preview log
//     commands.registerCommand('POSHI.previewlog', () => {
//       commands.executeCommand(
//         'vscode.previewHtml',
//         Uri.file('/home/lyon/liferay/portal/portal-6210/portal-web/test-results/ApplicationdisplaytemplatesUsecase_ADTWiki/index.html')
//       )
//     })
