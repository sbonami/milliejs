import * as BaseModule from "../../src"
import asyncCallback from "../../src/helpers/asyncCallback"
import { makeMockEntity } from "../../src/mocks/entity"
import { makeMockQuery } from "../../src/mocks/query"
import { makeMockResource } from "../../src/mocks/resource"

describe("helpers", () => {
  it("exports the asyncCallback helper", () => {
    expect(BaseModule.asyncCallback).toBe(asyncCallback)
  })
})

describe("mocks", () => {
  it("exports the makeMockEntity mock factory", () => {
    expect(BaseModule.makeMockEntity).toBe(makeMockEntity)
  })

  it("exports the makeMockQuery mock factory", () => {
    expect(BaseModule.makeMockQuery).toBe(makeMockQuery)
  })

  it("exports the makeMockResource mock factory", () => {
    expect(BaseModule.makeMockResource).toBe(makeMockResource)
  })
})
