const path = require("path")
const commonjs = require("@rollup/plugin-commonjs")
const replace = require("@rollup/plugin-replace")
const babel = require("rollup-plugin-babel")
const resolve = require("rollup-plugin-node-resolve")
const { terser } = require("rollup-plugin-terser")

const config = require("./config")

const options = [
  /** umd版本 */
  {
    name: "HsunaJS",
    format: "umd",
  },
  /** umd版本 */
  {
    name: "HsunaJS.min",
    format: "umd",
    minimize: true,
  },
  /** commonjs版本 */
  {
    name: "HsunaJS.common",
    format: "cjs",
  },
  /** ems版本 */
  {
    name: "HsunaJS.esm",
    format: "esm",
  },
]

module.exports = options.map((option) => {
  return {
    input: "src/index.js",
    output: {
      exports: "default",
      name: config.name,
      file: path.join(config.paths.output, `${option.name}.js`),
      format: option.format,
      banner: config.banner,
      plugins: [option.minimize && terser()].filter(Boolean),
    },
    external: option.external,
    plugins: [
      resolve({
        extensions: [".js", ".ts"],
      }),
      replace({
        "process.env.VERSION": JSON.stringify(config.version),
      }),
      babel({
        exclude: "node_modules/**",
        extensions: [".js", ".ts"],
        runtimeHelpers: true,
      }),
      commonjs(),
    ].filter(Boolean),
  }
})
