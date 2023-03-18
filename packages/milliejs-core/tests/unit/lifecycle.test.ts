import { LifecycleEvents } from "../../src/lifecycle"

describe("LifecycleEvents", () => {
  describe("LifecycleEvents.Delta", () => {
    it("is 'millie:delta'", () => {
      expect(LifecycleEvents.Delta).toBe("millie:delta")
    })
  })

  describe("LifecycleEvents.Save", () => {
    it("is 'millie:save'", () => {
      expect(LifecycleEvents.Save).toBe("millie:save")
    })
  })

  describe("LifecycleEvents.Delete", () => {
    it("is 'millie:delete'", () => {
      expect(LifecycleEvents.Delete).toBe("millie:delete")
    })
  })
})
