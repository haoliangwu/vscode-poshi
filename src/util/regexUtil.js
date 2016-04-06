export const commandRegex1 = {
  right: /(default|name|selenium)="([a-z])+(([A-Z])([a-z])*)+"/g,
  wrong: /(default|name|selenium)="(([A-Z])([a-z])*)+"/g
}

export const commandRegex = /<command name="\w+"/g

export const commandStandardRegex = {
  testcase: /"(([A-Z]|[0-9])([a-z])*)+"/
}
