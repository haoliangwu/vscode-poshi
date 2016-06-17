import { IPCMessageReader, IPCMessageWriter, createConnection } from 'vscode-languageserver'

export const connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process))
