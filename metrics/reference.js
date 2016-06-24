'use strict'

const rd = require('rd')
const fs = require('fs-extra')
const path = require('path')

const typeFilter = ['.testcase', '.macro']

function generateLocatorsReference (f, lines) {
  const fileName = path.parse(f).base

  lines.forEach(function (e, i) {
    var match = e.match(/([a-zA-Z0-9]+#[A-Z0-9_]+)/)

    // if (!match || match[1] !== 'CPMyworkflowtasks#ASSIGNED_TO_MY_ROLES_TABLE_ASSET_TITLE') return
    if (!match) return

    const reference = path.resolve(__dirname, `./reference/locators/${match[1]}.json`)

    fs.ensureFileSync(reference)

    let source = fs.readJsonSync(reference, {throws: false})

    if (source === null) source = {}

    const file = fileName
    const start = match.index
    const end = start + match[1].length
    const line = i

    if (!source[file]) source[file] = []

    source[file].push({line, start, end})

    fs.writeJsonSync(reference, source)

  // console.log(`writing ${match[1]} finished.`)
  })
}

function generateMacrosReference (f, lines) {
  const fileName = path.parse(f).base

  lines.forEach(function (e, i) {
    var match = e.match(/([a-zA-Z0-9]+#[a-z0-9]+[a-zA-Z0-9_]*)/)

    // if (!match || match[1] !== 'CPMyworkflowtasks#ASSIGNED_TO_MY_ROLES_TABLE_ASSET_TITLE') return
    if (!match) return

    const reference = path.resolve(__dirname, `./reference/macros/${match[1]}.json`)

    fs.ensureFileSync(reference)

    let source = fs.readJsonSync(reference, {throws: false})

    if (source === null) source = {}

    const file = fileName
    const start = match.index
    const end = start + match[1].length
    const line = i

    if (!source[file]) source[file] = []

    source[file].push({line, start, end})

    fs.writeJsonSync(reference, source)

  // console.log(`writing ${match[1]} finished.`)
  })
}

exports.generate = function (url) {
  fs.remove(path.resolve(__dirname, `./reference`), function (err) {
    if (err) return console.error(err)

    rd.eachSync(url, function (f, s) {
      if (s.isDirectory()) return

      const ext = path.parse(f).ext

      if (typeFilter.indexOf(ext) < 0) return

      new Promise(function (res) {
        fs.readFile(f, function (err, data) {
          if (err) throw err

          const lines = data.toString().split(/\r?\n/g)

          res(lines)
        })
      }).then(lines => {
        generateLocatorsReference(f, lines)
        generateMacrosReference(f, lines)
      })
    })
  })
}

// exports.generate('/home/lyon/liferay/portal/portal-62/portal-web/test/functional/com/liferay/portalweb')
