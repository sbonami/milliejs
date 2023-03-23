import type { Entity, Resource } from "@milliejs/core"
import { IncrementalStore } from "../../../../src/incremental"
import { CreateAction } from "../../../../src/incremental/actions/create"
import { makeMockPublisherWithEvents } from "../../mocks/publisher"

type MockResource = Resource
const mockResource: MockResource = {
  id: "MOCK RESOURCE",
}
const mockReplicaStore = makeMockPublisherWithEvents()
const mockStore = new IncrementalStore(mockResource, mockReplicaStore)

describe("CreateAction", () => {
  describe("new CreateAction", () => {
    it("should create an instance of CreateAction", () => {
      const action = new CreateAction(mockStore)

      expect(action).toBeInstanceOf(CreateAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("create", () => {
    it('throws a "Not Implemented" Error', () => {
      const mockEntity: Entity<MockResource> = {
        id: "a",
        resource: mockResource,
        data: {},
      }

      const action = new CreateAction(mockStore)

      expect(() => {
        action.create(mockEntity)
      }).toThrow("Not Implemented")
    })
  })
})
