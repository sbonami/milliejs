import type { Resource } from "@milliejs/core"
import { IncrementalStore } from "../../src/incremental"

type MockResource = Resource

describe("IncrementalStore", () => {
  let mockReplicaStore: jest.Mock
  let mockSourcePublisher: jest.Mock
  let mockSourceSubscriber: jest.Mock

  beforeEach(() => {
    mockReplicaStore = jest.fn()
    mockSourcePublisher = jest.fn()
    mockSourceSubscriber = jest.fn()
  })

  it("should create an instance of IncrementalStore", () => {
    const mockResource: MockResource = {
      id: "MOCK RESOURCE",
    }
    const store = new IncrementalStore(mockResource, mockReplicaStore, {
      sourcePublisher: mockSourcePublisher,
      sourceSubscriber: mockSourceSubscriber,
    })

    expect(store).toBeInstanceOf(IncrementalStore)
    expect(store.resource).toBe(mockResource)
    expect(store["replicaStore"]).toBe(mockReplicaStore)
    expect(store["sourcePublisher"]).toBe(mockSourcePublisher)
    expect(store["sourceSubscriber"]).toBe(mockSourceSubscriber)
  })

  describe("when the store is instantiated without the sourceInterface options", () => {
    it("should create an instance of IncrementalStore with undefined sourceInterfaces", () => {
      const mockResource: MockResource = {
        id: "MOCK RESOURCE",
      }
      const store = new IncrementalStore(mockResource, mockReplicaStore)

      expect(store).toBeInstanceOf(IncrementalStore)
      expect(store.resource).toBe(mockResource)
      expect(store["replicaStore"]).toBe(mockReplicaStore)
      expect(store["sourcePublisher"]).toBeUndefined()
      expect(store["sourceSubscriber"]).toBeUndefined()
    })
  })

  describe("when the store is instantiated with only the sourcePublisher interface option", () => {
    it("should create an instance of IncrementalStore with only the sourcePublisher", () => {
      const mockResource: MockResource = {
        id: "MOCK RESOURCE",
      }
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourcePublisher: mockSourceSubscriber,
      })

      expect(store).toBeInstanceOf(IncrementalStore)
      expect(store.resource).toBe(mockResource)
      expect(store["replicaStore"]).toBe(mockReplicaStore)
      expect(store["sourcePublisher"]).toBe(mockSourcePublisher)
      expect(store["sourceSubscriber"]).toBeUndefined()
    })
  })

  describe("when the store is instantiated with only the sourceSubscriber interface option", () => {
    it("should create an instance of IncrementalStore with only sourceSubscriber", () => {
      const mockResource: MockResource = {
        id: "MOCK RESOURCE",
      }
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourceSubscriber: mockSourceSubscriber,
      })

      expect(store).toBeInstanceOf(IncrementalStore)
      expect(store.resource).toBe(mockResource)
      expect(store["replicaStore"]).toBe(mockReplicaStore)
      expect(store["sourcePublisher"]).toBeUndefined()
      expect(store["sourceSubscriber"]).toBe(mockSourceSubscriber)
    })
  })
})
