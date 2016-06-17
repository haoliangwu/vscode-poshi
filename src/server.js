import { connection } from './models/ConnectionProxy'

try {
  connection.listen()
  connection.window.showInformationMessage(`Lang Server is listening the editor client.`)
} catch (error) {
  connection.window.showErrorMessage(`Lang Server failed to start up due to: ${error.stack}.`)
}
