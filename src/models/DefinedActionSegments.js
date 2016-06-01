import * as fs from 'fs'

fs.readFileSync('../metrics/definedActions.json', 'utf-8', (err, data) => {
  if (err) throw err

  module.export = JSON.parse(data)
})
