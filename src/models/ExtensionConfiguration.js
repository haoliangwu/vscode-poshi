import { workspace } from 'vscode'

export default class ExtensionConfiguration {
  constructor () {
    this.conf = workspace.getConfiguration('poshi')
  }

  get extensionName () {
    return 'vscode-poshi'
  }

  get raw () {
    return this.conf
  }

  get liferayHome () {
    return this.conf.get('liferay.home')
  }

  get poshiHome () {
    return this.conf.get('liferay.home') + this.conf.get('project.home')
  }
}
