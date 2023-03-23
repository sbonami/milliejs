/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  testRegex: "packages/(.*)/tests/(unit|integration)/(.*).(spec|test).ts",

  resetMocks: true,
}
