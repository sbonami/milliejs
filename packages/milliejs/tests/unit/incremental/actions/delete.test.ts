import { makeMockQuery, makeMockResource } from "@milliejs/jest-utils"
import { IncrementalStore } from "../../../../src/incremental"
import { DeleteAction } from "../../../../src/incremental/actions/delete"
import { makeMockPublisherWithEvents } from "../../mocks/publisher"

const mockResource = makeMockResource()
const mockReplicaStore = makeMockPublisherWithEvents()
const mockSourcePublisher = makeMockPublisherWithEvents()
const mockStore = new IncrementalStore(mockResource, mockReplicaStore, {
  sourcePublisher: mockSourcePublisher,
})

describe("DeleteAction", () => {
  beforeEach(() => {
    jest
      .spyOn(IncrementalStore.prototype, "replicaStore", "get")
      .mockReturnValue(mockReplicaStore)
    jest
      .spyOn(IncrementalStore.prototype, "sourcePublisher", "get")
      .mockReturnValue(mockSourcePublisher)
  })

  describe("new DeleteAction", () => {
    it("should create an instance of DeleteAction", () => {
      const action = new DeleteAction(mockStore)

      expect(action).toBeInstanceOf(DeleteAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("delete", () => {
    it("delete the resource in the replicaStore", async () => {
      const mockInputQuery = makeMockQuery()

      const action = new DeleteAction(mockStore)
      await action.delete(mockInputQuery)

      expect(mockReplicaStore.delete).toHaveBeenCalledWith(mockInputQuery)
    })

    it("deletes the source resource via the Publisher", async () => {
      const mockInputQuery = makeMockQuery()

      const action = new DeleteAction(mockStore)
      await action.delete(mockInputQuery)

      expect(mockSourcePublisher.delete).toHaveBeenCalledWith(mockInputQuery)
    })

    it("returns the resource deleted by the replicaStore", () => {
      const mockInputQuery = makeMockQuery()
      const mockReplicaEntity = jest.fn()
      ;(mockReplicaStore as any).delete.mockResolvedValue([mockReplicaEntity])
      const mockSourceEntity = jest.fn()
      ;(mockSourcePublisher as any).delete.mockResolvedValue([mockSourceEntity])

      const action = new DeleteAction(mockStore)

      expect(action.delete(mockInputQuery)).resolves.toBe(true)
    })
  })
})
