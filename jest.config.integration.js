/** @type {import('ts-jest').JestConfigWithTsJest} */
const base = require("./jest.config")

module.exports = {
  ...base,

  testRegex: "packages/(.*)/tests/integration/(.*).(spec|test).ts$",

  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
}
