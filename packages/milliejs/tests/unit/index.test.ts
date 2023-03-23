import type { Resource } from "@milliejs/core"
import * as StoreBaseModule from "@milliejs/store-base"
import { IncrementalStore } from "../../src/incremental"
import * as IncrementalStoreModule from "../../src/incremental"
import MillieJS from "../../src/index"
import type { PublisherActionEventInterface } from "../../src/store/events"
import { Worker } from "../../src/worker"
import { makeMockIncrementalStore } from "./mocks/incrementalStore"
import { makeMockPublisherWithEvents } from "./mocks/publisher"
import { makeMockSubscriber } from "./mocks/subscriber"

describe("MillieJS", () => {
  beforeEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  describe("registerResource", () => {
    it("generates a new IncrementalStore for the resource", () => {
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const spy = jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementation(() =>
          makeMockIncrementalStore(mockResource, mockReplicaStore),
        )

      const millie = new MillieJS()
      millie.registerResource(mockResource, mockReplicaStore)

      expect(spy).toHaveBeenCalledWith(mockResource, mockReplicaStore)
    })

    describe("when the resource is registered with a source publisher", () => {
      it("registers the source publisher for the resource", () => {
        const mockResource: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()
        jest
          .spyOn(IncrementalStoreModule, "IncrementalStore")
          .mockImplementation(() =>
            makeMockIncrementalStore(mockResource, mockReplicaStore),
          )

        const millie = new MillieJS()
        const spy = jest.spyOn(millie, "registerSourcePublisher")

        millie.registerResource(mockResource, mockReplicaStore, {
          sourcePublisher: mockSourcePublisher,
        })
        expect(spy).toHaveBeenCalledWith(mockResource, mockSourcePublisher)
      })
    })

    describe("when the resource is registered with a source subscriber", () => {
      it("registers the source subscriber for the resource", () => {
        const mockResource: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourceSubscriber = makeMockSubscriber()
        jest
          .spyOn(IncrementalStoreModule, "IncrementalStore")
          .mockImplementation(() =>
            makeMockIncrementalStore(mockResource, mockReplicaStore),
          )

        const millie = new MillieJS()
        const spy = jest.spyOn(millie, "registerSourceSubscriber")

        millie.registerResource(mockResource, mockReplicaStore, {
          sourceSubscriber: mockSourceSubscriber,
        })
        expect(spy).toHaveBeenCalledWith(mockResource, mockSourceSubscriber)
      })
    })

    it("returns the resource's IncrementalStore", () => {
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockIncrementalStore = makeMockIncrementalStore(
        mockResource,
        mockReplicaStore,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementation(() => mockIncrementalStore)

      const millie = new MillieJS()
      const response = millie.registerResource(mockResource, mockReplicaStore)
      expect(response).toBe(mockIncrementalStore)
    })
  })

  describe("registerSourcePublisher", () => {
    describe("when the resource has not yet been registered", () => {
      it("throws an error", () => {
        const mockResource: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockSourcePublisher = makeMockPublisherWithEvents()

        const millie = new MillieJS()
        expect(() => {
          millie.registerSourcePublisher(mockResource, mockSourcePublisher)
        }).toThrowErrorMatchingSnapshot()
      })
    })

    it("sets the sourcePublisher on the registered resource's IncrementalStore", (done) => {
      expect.assertions(1)

      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockIncrementalStore = makeMockIncrementalStore(
        mockResource,
        mockReplicaStore,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementation(() => mockIncrementalStore)

      const millie = new MillieJS()
      millie.registerResource(mockResource, mockReplicaStore)

      Object.defineProperty(mockIncrementalStore, "sourcePublisher", {
        set: (newSourcePublisher: any) => {
          try {
            expect(newSourcePublisher).toBe(mockSourcePublisher)
            done()
          } catch (error) {
            done(error)
          }
        },
      })
      millie.registerSourcePublisher(mockResource, mockSourcePublisher)
    })

    it("returns the resource's IncrementalStore", () => {
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockIncrementalStore = makeMockIncrementalStore(
        mockResource,
        mockReplicaStore,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementation(() => mockIncrementalStore)

      const millie = new MillieJS()
      millie.registerResource(mockResource, mockReplicaStore)

      const response = millie.registerSourcePublisher(
        mockResource,
        mockSourcePublisher,
      )
      expect(response).toBe(mockIncrementalStore)
    })
  })

  describe("registerSourceSubscriber", () => {
    describe("when the resource has not yet been registered", () => {
      it("throws an error", () => {
        const mockResource: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockSourceSubscriber = makeMockSubscriber()

        const millie = new MillieJS()
        expect(() => {
          millie.registerSourceSubscriber(mockResource, mockSourceSubscriber)
        }).toThrowErrorMatchingSnapshot()
      })
    })

    it("sets the sourceSubscriber on the registered resource's IncrementalStore", (done) => {
      expect.assertions(1)

      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const mockIncrementalStore = makeMockIncrementalStore(
        mockResource,
        mockReplicaStore,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementation(() => mockIncrementalStore)

      const millie = new MillieJS()
      millie.registerResource(mockResource, mockReplicaStore)

      Object.defineProperty(mockIncrementalStore, "sourceSubscriber", {
        set: (newSourceSubscriber: any) => {
          try {
            expect(newSourceSubscriber).toBe(mockSourceSubscriber)
            done()
          } catch (error) {
            done(error)
          }
        },
      })
      millie.registerSourceSubscriber(mockResource, mockSourceSubscriber)
    })

    it("returns the resource's IncrementalStore", () => {
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const mockIncrementalStore = makeMockIncrementalStore(
        mockResource,
        mockReplicaStore,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementation(() => mockIncrementalStore)

      const millie = new MillieJS()
      millie.registerResource(mockResource, mockReplicaStore)

      const response = millie.registerSourceSubscriber(
        mockResource,
        mockSourceSubscriber,
      )
      expect(response).toBe(mockIncrementalStore)
    })
  })

  describe("worker", () => {
    it("provides the Worker interface", () => {
      const millie = new MillieJS()
      expect(millie instanceof Worker).toBe(true)
    })

    describe("connections", () => {
      describe("[replicaStore]", () => {
        let mockResource: Resource
        let mockReplicaStore: PublisherActionEventInterface<Resource>
        let mockIncrementalStore: IncrementalStore

        beforeEach(() => {
          mockResource = {
            id: "MOCK RESOURCE",
          }
          mockReplicaStore = makeMockPublisherWithEvents()

          mockIncrementalStore = new IncrementalStore(
            mockResource,
            mockReplicaStore,
          )
          jest
            .spyOn(IncrementalStore.prototype, "replicaStore", "get")
            .mockImplementation(() => mockReplicaStore)
        })

        describe("when a replica store is a connection interface", () => {
          beforeEach(() => {
            jest
              .spyOn(StoreBaseModule, "isStoreLifecycleInterface")
              .mockReturnValue(false)
          })

          it("is included in the result", () => {
            const millie = new MillieJS()
            millie.registerResource(mockResource, mockReplicaStore)
            jest
              .spyOn(StoreBaseModule, "isStoreLifecycleInterface")
              .mockImplementation((connection: any) => {
                return connection === mockIncrementalStore.replicaStore
              })

            expect(millie).toHaveProperty(
              "connections",
              expect.arrayContaining([mockReplicaStore]),
            )
          })
        })

        describe("when a replica store is not a connection interface", () => {
          beforeEach(() => {
            jest
              .spyOn(StoreBaseModule, "isStoreLifecycleInterface")
              .mockReturnValue(false)
          })

          it("is not included in the result", () => {
            const millie = new MillieJS()
            millie.registerResource(mockResource, mockReplicaStore)

            expect(millie).toHaveProperty("connections", [])
          })
        })
      })

      describe("[source publisher]", () => {
        let mockResource: Resource
        let mockReplicaStore: PublisherActionEventInterface<Resource>
        let mockSourcePublisher: PublisherActionEventInterface<Resource>
        let mockIncrementalStore: IncrementalStore

        beforeEach(() => {
          mockResource = {
            id: "MOCK RESOURCE",
          }
          mockReplicaStore = makeMockPublisherWithEvents()
          mockSourcePublisher = makeMockPublisherWithEvents()

          mockIncrementalStore = new IncrementalStore(
            mockResource,
            mockReplicaStore,
            {
              sourcePublisher: mockSourcePublisher,
            },
          )
          jest
            .spyOn(IncrementalStore.prototype, "replicaStore", "get")
            .mockImplementation(() => mockReplicaStore)
          jest
            .spyOn(IncrementalStore.prototype, "sourcePublisher", "get")
            .mockImplementation(() => mockSourcePublisher)
        })

        describe("when a source publisher store is a connection interface", () => {
          beforeEach(() => {
            jest
              .spyOn(StoreBaseModule, "isStoreLifecycleInterface")
              .mockReturnValue(false)
          })

          it("is included in the result", () => {
            const millie = new MillieJS()
            millie.registerResource(mockResource, mockReplicaStore)
            jest
              .spyOn(StoreBaseModule, "isStoreLifecycleInterface")
              .mockImplementation((connection: any) => {
                return connection === mockIncrementalStore.sourcePublisher
              })

            expect(millie).toHaveProperty(
              "connections",
              expect.arrayContaining([mockSourcePublisher]),
            )
          })
        })

        describe("when a source publisher store is not a connection interface", () => {
          beforeEach(() => {
            jest
              .spyOn(StoreBaseModule, "isStoreLifecycleInterface")
              .mockReturnValue(false)
          })

          it("is not included in the result", () => {
            const millie = new MillieJS()
            millie.registerResource(mockResource, mockReplicaStore)

            expect(millie).toHaveProperty("connections", [])
          })
        })
      })

      describe("[source subscriber]", () => {
        let mockResource: Resource
        let mockReplicaStore: PublisherActionEventInterface<Resource>
        let mockSourceSubscriber: StoreBaseModule.SubscriberActionInterface
        let mockIncrementalStore: IncrementalStore

        beforeEach(() => {
          mockResource = {
            id: "MOCK RESOURCE",
          }
          mockReplicaStore = makeMockPublisherWithEvents()
          mockSourceSubscriber = makeMockSubscriber()

          mockIncrementalStore = new IncrementalStore(
            mockResource,
            mockReplicaStore,
            {
              sourceSubscriber: mockSourceSubscriber,
            },
          )
          jest
            .spyOn(IncrementalStore.prototype, "replicaStore", "get")
            .mockImplementation(() => mockReplicaStore)
          jest
            .spyOn(IncrementalStore.prototype, "sourceSubscriber", "get")
            .mockImplementation(() => mockSourceSubscriber)
        })

        describe("when a source publisher store is a connection interface", () => {
          beforeEach(() => {
            jest
              .spyOn(StoreBaseModule, "isStoreLifecycleInterface")
              .mockReturnValue(false)
          })

          it("is included in the result", () => {
            const millie = new MillieJS()
            millie.registerResource(mockResource, mockReplicaStore)
            jest
              .spyOn(StoreBaseModule, "isStoreLifecycleInterface")
              .mockImplementation((connection: any) => {
                return connection === mockIncrementalStore.sourceSubscriber
              })

            expect(millie).toHaveProperty(
              "connections",
              expect.arrayContaining([mockSourceSubscriber]),
            )
          })
        })

        describe("when a source publisher store is not a connection interface", () => {
          beforeEach(() => {
            jest
              .spyOn(StoreBaseModule, "isStoreLifecycleInterface")
              .mockReturnValue(false)
          })

          it("is not included in the result", () => {
            const millie = new MillieJS()
            millie.registerResource(mockResource, mockReplicaStore)

            expect(millie).toHaveProperty("connections", [])
          })
        })
      })
    })
  })
})
