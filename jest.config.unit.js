/** @type {import('ts-jest').JestConfigWithTsJest} */
const base = require("./jest.config")

module.exports = {
  ...base,

  testRegex: "packages/(.*)/tests/unit/(.*).(spec|test).ts$",
}
