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

export const locator1Group = /locator1="(\w+)#(\w+)"/

export const indexSyntaxGroup = /(\w+)#(\w+)/

export const locatorBlock = /(<td>)(.+)(<\/td>)\s+\1(.+)\3/g

export const locatorLine = /<td>(.*)<\/td>/

// `name="${command_name}"`, `<td>${command_name}</td>`
export const nameMappingByType = function (type, command_name) {
  if (type !== 'path') return `name="${command_name}"`
  else return `<td>${command_name}</td>`
}
