import * as CoreModule from "../../src/index"
import { isEntity } from "../../src/entity"

describe("@milliejs/core", () => {
  it("exports the isEntity type predicate", () => {
    expect(CoreModule.isEntity).toBe(isEntity)
  })
})
