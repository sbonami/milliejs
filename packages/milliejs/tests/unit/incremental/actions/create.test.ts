import type { Entity, Resource } from "@milliejs/core"
import { IncrementalStore } from "../../../../src/incremental"
import { CreateAction } from "../../../../src/incremental/actions/create"
import { makeMockPublisherWithEvents } from "../../mocks/publisher"

type MockResource = Resource
const mockResource: MockResource = {
  id: "MOCK RESOURCE",
}
const mockReplicaStore = makeMockPublisherWithEvents()
const mockSourcePublisher = makeMockPublisherWithEvents()
const mockStore = new IncrementalStore(mockResource, mockReplicaStore, {
  sourcePublisher: mockSourcePublisher,
})

describe("CreateAction", () => {
  beforeEach(() => {
    jest
      .spyOn(IncrementalStore.prototype, "replicaStore", "get")
      .mockReturnValue(mockReplicaStore)
    jest
      .spyOn(IncrementalStore.prototype, "sourcePublisher", "get")
      .mockReturnValue(mockSourcePublisher)
  })

  describe("new CreateAction", () => {
    it("should create an instance of CreateAction", () => {
      const action = new CreateAction(mockStore)

      expect(action).toBeInstanceOf(CreateAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("create", () => {
    it("creates the resource in the replicaStore", async () => {
      const mockEntity: Entity<MockResource> = {
        id: "a",
        resource: mockResource,
        data: {},
      }

      const action = new CreateAction(mockStore)
      await action.create(mockEntity)

      expect(mockReplicaStore.create).toHaveBeenCalledWith(mockEntity)
    })

    it("creates the resource in the source via the Publisher", async () => {
      const mockEntity: Entity<MockResource> = {
        id: "a",
        resource: mockResource,
        data: {},
      }

      const action = new CreateAction(mockStore)
      await action.create(mockEntity)

      expect(mockSourcePublisher.create).toHaveBeenCalledWith(mockEntity)
    })

    it("returns the resource created by the replicaStore", () => {
      const mockInputEntity: Entity<MockResource> = {
        id: "a",
        resource: mockResource,
        data: {},
      }
      const mockReplicaEntity = jest.fn()
      ;(mockReplicaStore as any).create.mockResolvedValue(mockReplicaEntity)
      const mockSourceEntity = jest.fn()
      ;(mockSourcePublisher as any).create.mockResolvedValue(mockSourceEntity)

      const action = new CreateAction(mockStore)

      expect(action.create(mockInputEntity)).resolves.toBe(mockReplicaEntity)
    })
  })
})
