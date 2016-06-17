import { Range, Position } from 'vscode'

export const getRange = (line, start, end) => {
  return new Range(new Position(line, start), new Position(line, end))
}
