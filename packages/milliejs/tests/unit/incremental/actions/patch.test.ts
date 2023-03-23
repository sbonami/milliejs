import type { Query, Resource } from "@milliejs/core"
import { IncrementalStore } from "../../../../src/incremental"
import { PatchAction } from "../../../../src/incremental/actions/patch"
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

describe("PatchAction", () => {
  beforeEach(() => {
    jest
      .spyOn(IncrementalStore.prototype, "replicaStore", "get")
      .mockReturnValue(mockReplicaStore)
    jest
      .spyOn(IncrementalStore.prototype, "sourcePublisher", "get")
      .mockReturnValue(mockSourcePublisher)
  })

  describe("new PatchAction", () => {
    it("should create an instance of ReadAction", () => {
      const action = new PatchAction(mockStore)

      expect(action).toBeInstanceOf(PatchAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("patch", () => {
    it("patches the resource in the replicaStore", async () => {
      const mockInputQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }
      const mockInputPatch = {}

      const action = new PatchAction(mockStore)
      await action.patch(mockInputQuery, mockInputPatch)

      expect(mockReplicaStore.patch).toHaveBeenCalledWith(
        mockInputQuery,
        mockInputPatch,
      )
    })

    it("patches the source resource via the Publisher", async () => {
      const mockInputQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }
      const mockInputPatch = {}

      const action = new PatchAction(mockStore)
      await action.patch(mockInputQuery, mockInputPatch)

      expect(mockSourcePublisher.patch).toHaveBeenCalledWith(
        mockInputQuery,
        mockInputPatch,
      )
    })

    it("returns the patched resource from the replicaStore", () => {
      const mockInputQuery: Query = {
        resource: mockResource,
        cardinality: "many",
        attributes: {},
      }
      const mockInputPatch = {}
      const mockReplicaEntity = jest.fn()
      ;(mockReplicaStore as any).patch.mockResolvedValue([mockReplicaEntity])
      const mockSourceEntity = jest.fn()
      ;(mockSourcePublisher as any).patch.mockResolvedValue([mockSourceEntity])

      const action = new PatchAction(mockStore)

      expect(action.patch(mockInputQuery, mockInputPatch)).resolves.toEqual([
        mockReplicaEntity,
      ])
    })
  })
})
