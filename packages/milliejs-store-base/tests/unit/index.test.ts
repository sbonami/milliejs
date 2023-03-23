export { LifecycleEvents, isEntity, isQuery } from "@milliejs/core"
import * as StoreBaseModule from "../../src/index"
import { isPublisherActionInterface } from "../../src/publisher"

describe("@milliejs/store-base", () => {
  it("exports the isPublisherActionInterface type predicate", () => {
    expect(StoreBaseModule.isPublisherActionInterface).toBe(
      isPublisherActionInterface,
    )
  })

  it("re-exports the core's LifecycleEvents", () => {
    expect(StoreBaseModule.LifecycleEvents).toBe(LifecycleEvents)
  })

  it("re-exports the core's isEntity", () => {
    expect(StoreBaseModule.isEntity).toBe(isEntity)
  })

  it("re-exports the core's isQuery", () => {
    expect(StoreBaseModule.isQuery).toBe(isQuery)
  })
})
