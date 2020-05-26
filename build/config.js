"use strict"

const path = require("path")
const pkg = require("../package.json")

// Hardcoding here (and not reading from package.json) as the files are built
// before the version is updated in package.json
const version = process.env.VERSION || pkg.version

const banner = `/*!
  * HsunaJS.js v${version}
  * (c) 2020-${new Date().getFullYear()} Evan You
  * Released under the MIT License.
  */`

module.exports = {
  name: "HsunaJS",
  banner,
  version,

  paths: {
    root: path.join(__dirname, ".."),
    entry: path.join(__dirname, "..", "src/index.js"),
    output: path.join(__dirname, "..", "lib"),
  },

  resolve(location) {
    return path.join(__dirname, "..", location)
  },
}
