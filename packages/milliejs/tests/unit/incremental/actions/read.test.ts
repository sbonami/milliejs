import type { Query, Resource } from "@milliejs/core"
import { IncrementalStore } from "../../../../src/incremental"
import { ReadAction } from "../../../../src/incremental/actions/read"
import { makeMockPublisherWithEvents } from "../../mocks/publisher"

type MockResource = Resource
const mockResource: MockResource = {
  id: "MOCK RESOURCE",
}
const mockReplicaStore = makeMockPublisherWithEvents()
const mockStore = new IncrementalStore(mockResource, mockReplicaStore)

describe("ReadAction", () => {
  describe("new ReadAction", () => {
    it("should create an instance of ReadAction", () => {
      const action = new ReadAction(mockStore)

      expect(action).toBeInstanceOf(ReadAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("read", () => {
    it('throws a "Not Implemented" Error', () => {
      const mockQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }

      const action = new ReadAction(mockStore)

      expect(() => {
        action.read(mockQuery)
      }).toThrow("Not Implemented")
    })
  })
})
