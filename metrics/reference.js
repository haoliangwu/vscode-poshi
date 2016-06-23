'use strict'

const rd = require('rd')
const fs = require('fs-extra')
const path = require('path')

const branches = ['6210', '62', 'master']
const typeFilter = ['.testcase', '.macro']

function generateLocatorsReference (url) {
  rd.eachSync(url, function (f, s) {
    if (s.isDirectory()) return

    const fileName = path.parse(f).base
    const ext = path.parse(f).ext

    if (typeFilter.indexOf(ext) < 0) return

    var p = new Promise(function (res) {
      fs.readFile(f, function (err, data) {
        if (err) throw err

        const lines = data.toString().split(/\r?\n/g)

        res(lines)
      })
    })

    p.then(lines => {
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
    })
  })
}

exports.generate = function () {
  branches.forEach(e => {
    var url = `/home/lyon/liferay/portal/portal-${e}/portal-web/test/functional/com/liferay/portalweb`

    generateLocatorsReference(url)
  })
}

exports.generate()
