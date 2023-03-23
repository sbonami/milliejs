import type { Query, Resource } from "@milliejs/core"
import { IncrementalStore } from "../../../../src/incremental"
import { UpdateAction } from "../../../../src/incremental/actions/update"
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

describe("UpdateAction", () => {
  beforeEach(() => {
    jest
      .spyOn(IncrementalStore.prototype, "replicaStore", "get")
      .mockReturnValue(mockReplicaStore)
    jest
      .spyOn(IncrementalStore.prototype, "sourcePublisher", "get")
      .mockReturnValue(mockSourcePublisher)
  })

  describe("new UpdateAction", () => {
    it("should create an instance of ReadAction", () => {
      const action = new UpdateAction(mockStore)

      expect(action).toBeInstanceOf(UpdateAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("update", () => {
    it("updates the resource in the replicaStore", async () => {
      const mockInputQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }
      const mockInputPayload = {}

      const action = new UpdateAction(mockStore)
      await action.update(mockInputQuery, mockInputPayload)

      expect(mockReplicaStore.update).toHaveBeenCalledWith(
        mockInputQuery,
        mockInputPayload,
      )
    })

    it("updates the source resource via the Publisher", async () => {
      const mockInputQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }
      const mockInputPayload = {}

      const action = new UpdateAction(mockStore)
      await action.update(mockInputQuery, mockInputPayload)

      expect(mockSourcePublisher.update).toHaveBeenCalledWith(
        mockInputQuery,
        mockInputPayload,
      )
    })

    it("returns the updated resource from the replicaStore", () => {
      const mockInputQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }
      const mockInputPayload = {}
      const mockReplicaEntity = jest.fn()
      ;(mockReplicaStore as any).update.mockResolvedValue([mockReplicaEntity])
      const mockSourceEntity = jest.fn()
      ;(mockSourcePublisher as any).update.mockResolvedValue([mockSourceEntity])

      const action = new UpdateAction(mockStore)

      expect(action.update(mockInputQuery, mockInputPayload)).resolves.toEqual([
        mockReplicaEntity,
      ])
    })
  })
})
