import * as MockBaseModule from "../../../src/mocks"
import { makeMockEntity } from "../../../src/mocks/entity"
import { makeMockQuery } from "../../../src/mocks/query"
import { makeMockResource } from "../../../src/mocks/resource"

describe("mocks", () => {
  it("exports the makeMockEntity mock factory", () => {
    expect(MockBaseModule.makeMockEntity).toBe(makeMockEntity)
  })

  it("exports the makeMockQuery mock factory", () => {
    expect(MockBaseModule.makeMockQuery).toBe(makeMockQuery)
  })

  it("exports the makeMockResource mock factory", () => {
    expect(MockBaseModule.makeMockResource).toBe(makeMockResource)
  })
})
