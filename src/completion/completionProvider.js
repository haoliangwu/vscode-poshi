import { CompletionItemKind } from 'vscode-languageserver'

export const completionSource = [
  {
    label: 'TypeScript',
    kind: CompletionItemKind.Text,
    data: 1
  },
  {
    label: 'JavaScript',
    kind: CompletionItemKind.Text,
    data: 2
  }
]

export const completionInfoSource = [
  {
    detail: 'TypeScript details',
    documentation: 'TypeScript documentation'
  },
  {
    detail: 'TypeScript details',
    documentation: 'TypeScript documentation'
  }
]
