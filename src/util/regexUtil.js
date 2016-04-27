export const linesRegex = /\r?\n/g

export const commandRegex = /<command name="\w+"/g

export const commandRegexGroup = /<command name="(\w+)"/

export const commandName = /"(\w+)"/

export const commandStandardRegex = {
  testcase: /"(([A-Z]|[0-9])([a-z])*)+"/
}

export const _varLineRegex = /<var.*\/>/

export const _varReferenceGroup = /\${(.+)}/

export const nameRegexGroup = /name="(\w+)"/

export const valueRegexGroup = /value="(.+)"/

export const executeBlock = /<execute.+>[\s\S]+<\/execute>/
