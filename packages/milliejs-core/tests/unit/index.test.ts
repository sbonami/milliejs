import * as CoreModule from "../../src/index"
import { isEntity } from "../../src/entity"
import { LifecycleEvents } from "../../src/lifecycle"

describe("@milliejs/core", () => {
  it("exports the isEntity type predicate", () => {
    expect(CoreModule.isEntity).toBe(isEntity)
  })

  it("exports the LifecycleEvents constants", () => {
    expect(CoreModule.LifecycleEvents).toBe(LifecycleEvents)
  })
})
