import type { Query, Resource } from "@milliejs/core"
import { IncrementalStore } from "../../../../src/incremental"
import { DeleteAction } from "../../../../src/incremental/actions/delete"
import { makeMockPublisherWithEvents } from "../../mocks/publisher"

type MockResource = Resource
const mockResource: MockResource = {
  id: "MOCK RESOURCE",
}
const mockReplicaStore = makeMockPublisherWithEvents()
const mockStore = new IncrementalStore(mockResource, mockReplicaStore)

describe("DeleteAction", () => {
  describe("new DeleteAction", () => {
    it("should create an instance of DeleteAction", () => {
      const action = new DeleteAction(mockStore)

      expect(action).toBeInstanceOf(DeleteAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("delete", () => {
    it('throws a "Not Implemented" Error', () => {
      const mockQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }

      const action = new DeleteAction(mockStore)

      expect(() => {
        action.delete(mockQuery)
      }).toThrow("Not Implemented")
    })
  })
})
