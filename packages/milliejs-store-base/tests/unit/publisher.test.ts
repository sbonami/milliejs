import type { Resource } from "@milliejs/core"
import {
  PublisherActionInterface,
  isPublisherActionInterface,
} from "../../src/publisher"

type MockResource = Resource
const mockResource: Resource = {
  id: "mock",
}
const conformingObject: PublisherActionInterface<MockResource> = {}

describe("publisher", () => {
  describe("isPublisherActionInterface", () => {
    it("should return true", () => {
      expect(isPublisherActionInterface<MockResource>(conformingObject)).toBe(
        true,
      )
    })
  })
})
