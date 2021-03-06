import { workspace, window, commands, TextEditorRevealType } from 'vscode'
import { mappingWholeNames, mappingCommandLine } from './util/mappingUtil'
import * as vscodeUtil from './util/vscodeUtil'

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
      window.showTextDocument(doc).then(editor => {
        commands.executeCommand('workbench.files.action.addToWorkingFiles', doc)
      })
    })
  })
}

export const quickOpenCommand = () => {
  // TODO 改为更通用的命令，可以打开所有的PO对象
  const inputOpts = {
    placeHolder: 'Open file by POSHI invocation syntax, eg:fileName#commandName',
    validateInput: (input) => {
      if (input.indexOf('#') < 0) {
        return 'The input should contain "#" mark'
      }

      const reg = /\w+#\w+/i

      if (!reg.test(input)) {
        return 'The input string is not valid.'
      }
    }
  }

  const InputSending = window.showInputBox(inputOpts)

  InputSending.then(input => {
    if (!input) return
    const [root, command] = input.split('#')
    const map = mappingCommandLine[root]

    if (!map) {
      window.showInformationMessage("The target file didn't exist in mapping")
      return
    }

    const file = map.get(command)

    if (!file) {
      window.showInformationMessage("The command segment didn't exist in mapping")
      return
    }

    const {uri, location} = file
    const [line, start, end] = location

    if (uri) {
      workspace.openTextDocument(uri).then(doc => {
        window.showTextDocument(doc).then(editor => {
          commands.executeCommand('workbench.files.action.addToWorkingFiles', doc).then(() => {
            editor.revealRange(vscodeUtil.getRange(line, start, end), TextEditorRevealType.InCenter)
          })
        })
      })
    } else {
      window.showInformationMessage("The target file or command segment didn't exist")
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
