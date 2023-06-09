import { makeMockQuery, makeMockResource } from "@milliejs/jest-utils"
import { IncrementalStore } from "../../../../src/incremental"
import { ReadAction } from "../../../../src/incremental/actions/read"
import { makeMockPublisherWithEvents } from "../../mocks/publisher"

const mockResource = makeMockResource()
const mockReplicaStore = makeMockPublisherWithEvents()
const mockSourcePublisher = makeMockPublisherWithEvents()
const mockStore = new IncrementalStore(mockResource, mockReplicaStore, {
  sourcePublisher: mockSourcePublisher,
})

describe("ReadAction", () => {
  describe("new ReadAction", () => {
    it("should create an instance of ReadAction", () => {
      const action = new ReadAction(mockStore)

      expect(action).toBeInstanceOf(ReadAction)
      expect(action["store"]).toBe(mockStore)
    })
  })

  describe("read", () => {
    it("reads the resource from the replicaStore", async () => {
      const mockInputQuery = makeMockQuery()

      const action = new ReadAction(mockStore)
      await action.read(mockInputQuery)

      expect(mockReplicaStore.read).toHaveBeenCalledWith(mockInputQuery)
    })

    it("reads the resource from the source via the Publisher", async () => {
      const mockInputQuery = makeMockQuery()

      const action = new ReadAction(mockStore)
      await action.read(mockInputQuery)

      expect(mockSourcePublisher.read).toHaveBeenCalledWith(mockInputQuery)
    })

    it("returns the resource created by the replicaStore", () => {
      const mockInputQuery = makeMockQuery()
      const mockReplicaEntity = jest.fn()
      ;(mockReplicaStore as any).read.mockResolvedValue([mockReplicaEntity])
      const mockSourceEntity = jest.fn()
      ;(mockSourcePublisher as any).read.mockResolvedValue([mockSourceEntity])

      const action = new ReadAction(mockStore)

      expect(action.read(mockInputQuery)).resolves.toEqual([mockReplicaEntity])
    })
  })
})
