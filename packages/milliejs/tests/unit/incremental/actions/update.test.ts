import type { Query, Resource } from "@milliejs/core"
import { IncrementalStore } from "../../../../src/incremental"
import { UpdateAction } from "../../../../src/incremental/actions/update"
import { makeMockPublisherWithEvents } from "../../mocks/publisher"

type MockResource = Resource
const mockResource: MockResource = {
  id: "MOCK RESOURCE",
}
const mockReplicaStore = makeMockPublisherWithEvents()
const mockStore = new IncrementalStore(mockResource, mockReplicaStore)

describe("UpdateAction", () => {
  describe("new UpdateAction", () => {
    it("should create an instance of ReadAction", () => {
      const action = new UpdateAction(mockStore)

      expect(action).toBeInstanceOf(UpdateAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("update", () => {
    it('throws a "Not Implemented" Error', () => {
      const mockQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }

      const action = new UpdateAction(mockStore)
      const data = {}

      expect(() => {
        action.update(mockQuery, data)
      }).toThrow("Not Implemented")
    })
  })
})
