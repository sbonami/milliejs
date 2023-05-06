/** @type {import('ts-jest').JestConfigWithTsJest} */
const base = require("./jest.config")

// eslint-disable-next-line no-undef
module.exports = {
  ...base,

  testRegex: "packages/(.*)/tests/unit/(.*).(spec|test).ts$",
}
