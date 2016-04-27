export const linesRegex = /\r?\n/g

export const commandRegex = /<command name="\w+"/g

export const commandRegexGroup = /<command name="(\w+)"/

export const commandName = /"(\w+)"/

export const commandStandardRegex = {
  testcase: /"(([A-Z]|[0-9])([a-z])*)+"/
}
