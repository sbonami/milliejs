import type { Query, Resource } from "@milliejs/core"
import { IncrementalStore } from "../../../../src/incremental"
import { PatchAction } from "../../../../src/incremental/actions/patch"
import { makeMockPublisherWithEvents } from "../../mocks/publisher"

type MockResource = Resource
const mockResource: MockResource = {
  id: "MOCK RESOURCE",
}
const mockReplicaStore = makeMockPublisherWithEvents()
const mockStore = new IncrementalStore(mockResource, mockReplicaStore)

describe("PatchAction", () => {
  describe("new PatchAction", () => {
    it("should create an instance of ReadAction", () => {
      const action = new PatchAction(mockStore)

      expect(action).toBeInstanceOf(PatchAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("patch", () => {
    it('throws a "Not Implemented" Error', () => {
      const mockQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }

      const action = new PatchAction(mockStore)
      const data = {}

      expect(() => {
        action.patch(mockQuery, data)
      }).toThrow("Not Implemented")
    })
  })
})
