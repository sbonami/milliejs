import * as BaseModule from "../../src"
import { makeMockEntity } from "../../src/mocks/entity"
import { makeMockQuery } from "../../src/mocks/query"
import { makeMockResource } from "../../src/mocks/resource"

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
