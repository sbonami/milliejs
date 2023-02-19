import * as StoreBaseModule from "../../src/index"
import { isPublisherActionInterface } from "../../src/publisher"

describe("@milliejs/store-base", () => {
  it("exports the isPublisherActionInterface type predicate", () => {
    expect(StoreBaseModule.isPublisherActionInterface).toBe(
      isPublisherActionInterface,
    )
  })
})
