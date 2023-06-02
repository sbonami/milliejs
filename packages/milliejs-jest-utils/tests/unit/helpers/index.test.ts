import * as HelpersBaseModule from "../../../src/helpers"
import asyncCallback from "../../../src/helpers/asyncCallback"

describe("mocks", () => {
  it("exports the asyncCallback helper", () => {
    expect(HelpersBaseModule.asyncCallback).toBe(asyncCallback)
  })
})
