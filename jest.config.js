/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  collectCoverage: true,
  collectCoverageFrom: ["packages/*/src/**/*.{js,ts}"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  resetMocks: true,
}
