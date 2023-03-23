import type { Entity, Query, Resource } from "@milliejs/core"
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

  describe("[create]", () => {
    it("forwards the create call to the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockResource2: Resource = {
        id: "MOCK RESOURCE 2",
      }
      const mockReplicaStore2 = makeMockPublisherWithEvents()
      const mockIncrementalStore2 = makeMockIncrementalStore(
        mockResource2,
        mockReplicaStore2,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore2)

      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      millie.registerResource(mockResource2, mockReplicaStore2)

      const mockData = jest.fn()
      millie.create(mockResource1, mockData)
      expect(mockIncrementalStore1.create).toHaveBeenCalledWith(mockData)
      expect(mockIncrementalStore2.create).not.toHaveBeenCalled()
    })

    it("returns the create response from the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockOutputEntity: Entity<Resource> = {
        id: "a",
        resource: mockResource1,
        data: {},
      }
      jest.spyOn(mockIncrementalStore1, "create").mockResolvedValue(mockOutputEntity)

      const mockData = jest.fn()
      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      expect(millie.create(mockResource1, mockData)).resolves.toBe(mockOutputEntity)
    })

    describe("when MillieJS has not yet registered the resource", () => {
      it("throws a helpful error", () => {
        const mockResource1: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore1 = makeMockPublisherWithEvents()
        const mockIncrementalStore1 = makeMockIncrementalStore(
          mockResource1,
          mockReplicaStore1,
        )
        jest
          .spyOn(IncrementalStoreModule, "IncrementalStore")
          .mockImplementationOnce(() => mockIncrementalStore1)

        const mockResource2: Resource = {
          id: "MOCK RESOURCE 2",
        }

        const millie = new MillieJS()
        millie.registerResource(mockResource1, mockReplicaStore1)

        const mockData = jest.fn()

        expect(() => {
          millie.create(mockResource2, mockData)
        }).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe("[read]", () => {
    it("forwards the read call to the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockResource2: Resource = {
        id: "MOCK RESOURCE 2",
      }
      const mockReplicaStore2 = makeMockPublisherWithEvents()
      const mockIncrementalStore2 = makeMockIncrementalStore(
        mockResource2,
        mockReplicaStore2,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore2)

      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      millie.registerResource(mockResource2, mockReplicaStore2)

      const mockInputQuery: Query = {
        resource: mockResource1,
        cardinality: "many",
        attributes: {},
      }
      millie.read(mockResource1, mockInputQuery)
      expect(mockIncrementalStore1.read).toHaveBeenCalledWith(mockInputQuery)
      expect(mockIncrementalStore2.read).not.toHaveBeenCalled()
    })

    it("returns the read response from the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockOutputEntity: Entity<Resource> = {
        id: "a",
        resource: mockResource1,
        data: {},
      }
      jest.spyOn(mockIncrementalStore1, "read").mockResolvedValue([mockOutputEntity])

      const mockInputQuery: Query = {
        resource: mockResource1,
        cardinality: "many",
        attributes: {},
      }
      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      expect(millie.read(mockResource1, mockInputQuery)).resolves.toEqual([mockOutputEntity])
    })

    describe("when MillieJS has not yet registered the resource", () => {
      it("throws a helpful error", () => {
        const mockResource1: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore1 = makeMockPublisherWithEvents()
        const mockIncrementalStore1 = makeMockIncrementalStore(
          mockResource1,
          mockReplicaStore1,
        )
        jest
          .spyOn(IncrementalStoreModule, "IncrementalStore")
          .mockImplementationOnce(() => mockIncrementalStore1)

        const mockResource2: Resource = {
          id: "MOCK RESOURCE 2",
        }

        const millie = new MillieJS()
        millie.registerResource(mockResource1, mockReplicaStore1)

        const mockInputQuery: Query = {
          resource: mockResource2,
          cardinality: "many",
          attributes: {},
        }
        expect(() => {
          millie.read(mockResource2, mockInputQuery)
        }).toThrowErrorMatchingSnapshot()
      })
    })

    describe("when the Query payload's resource does not match the passed resource", () => {
      it("throws a helpful error", () => {
        const mockResource1: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore1 = makeMockPublisherWithEvents()
        const mockIncrementalStore1 = makeMockIncrementalStore(
          mockResource1,
          mockReplicaStore1,
        )
        jest
          .spyOn(IncrementalStoreModule, "IncrementalStore")
          .mockImplementationOnce(() => mockIncrementalStore1)

        const mockResource2: Resource = {
          id: "MOCK RESOURCE 2",
        }

        const millie = new MillieJS()
        millie.registerResource(mockResource1, mockReplicaStore1)

        const mockData = jest.fn()

        const mockInputQuery: Query = {
          resource: mockResource2,
          cardinality: "many",
          attributes: {},
        }
        expect(() => {
          millie.read(mockResource1, mockInputQuery)
        }).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe("[update]", () => {
    it("forwards the update call to the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockResource2: Resource = {
        id: "MOCK RESOURCE 2",
      }
      const mockReplicaStore2 = makeMockPublisherWithEvents()
      const mockIncrementalStore2 = makeMockIncrementalStore(
        mockResource2,
        mockReplicaStore2,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore2)

      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      millie.registerResource(mockResource2, mockReplicaStore2)

      const mockData = jest.fn()
      const mockInputQuery: Query = {
        resource: mockResource1,
        cardinality: "many",
        attributes: {},
      }
      millie.update(mockResource1, mockInputQuery, mockData)
      expect(mockIncrementalStore1.update).toHaveBeenCalledWith(mockInputQuery, mockData)
      expect(mockIncrementalStore2.update).not.toHaveBeenCalled()
    })

    it("returns the update response from the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockOutputEntity: Entity<Resource> = {
        id: "a",
        resource: mockResource1,
        data: {},
      }
      jest.spyOn(mockIncrementalStore1, "update").mockResolvedValue([mockOutputEntity])

      const mockData = jest.fn()
      const mockInputQuery: Query = {
        resource: mockResource1,
        cardinality: "many",
        attributes: {},
      }
      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      expect(millie.update(mockResource1, mockInputQuery, mockData)).resolves.toEqual([mockOutputEntity])
    })

    describe("when MillieJS has not yet registered the resource", () => {
      it("throws a helpful error", () => {
        const mockResource1: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore1 = makeMockPublisherWithEvents()
        const mockIncrementalStore1 = makeMockIncrementalStore(
          mockResource1,
          mockReplicaStore1,
        )
        jest
          .spyOn(IncrementalStoreModule, "IncrementalStore")
          .mockImplementationOnce(() => mockIncrementalStore1)

        const mockResource2: Resource = {
          id: "MOCK RESOURCE 2",
        }

        const millie = new MillieJS()
        millie.registerResource(mockResource1, mockReplicaStore1)

        const mockData = jest.fn()
        const mockInputQuery: Query = {
          resource: mockResource1,
          cardinality: "many",
          attributes: {},
        }

        expect(() => {
          millie.update(mockResource2, mockInputQuery, mockData)
        }).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe("[patch]", () => {
    it("forwards the patch call to the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockResource2: Resource = {
        id: "MOCK RESOURCE 2",
      }
      const mockReplicaStore2 = makeMockPublisherWithEvents()
      const mockIncrementalStore2 = makeMockIncrementalStore(
        mockResource2,
        mockReplicaStore2,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore2)

      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      millie.registerResource(mockResource2, mockReplicaStore2)

      const mockData = jest.fn()
      const mockInputQuery: Query = {
        resource: mockResource1,
        cardinality: "many",
        attributes: {},
      }
      millie.patch(mockResource1, mockInputQuery, mockData)
      expect(mockIncrementalStore1.patch).toHaveBeenCalledWith(mockInputQuery, mockData)
      expect(mockIncrementalStore2.patch).not.toHaveBeenCalled()
    })

    it("returns the patch response from the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockOutputEntity: Entity<Resource> = {
        id: "a",
        resource: mockResource1,
        data: {},
      }
      jest.spyOn(mockIncrementalStore1, "patch").mockResolvedValue([mockOutputEntity])

      const mockData = jest.fn()
      const mockInputQuery: Query = {
        resource: mockResource1,
        cardinality: "many",
        attributes: {},
      }
      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      expect(millie.patch(mockResource1, mockInputQuery, mockData)).resolves.toEqual([mockOutputEntity])
    })

    describe("when MillieJS has not yet registered the resource", () => {
      it("throws a helpful error", () => {
        const mockResource1: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore1 = makeMockPublisherWithEvents()
        const mockIncrementalStore1 = makeMockIncrementalStore(
          mockResource1,
          mockReplicaStore1,
        )
        jest
          .spyOn(IncrementalStoreModule, "IncrementalStore")
          .mockImplementationOnce(() => mockIncrementalStore1)

        const mockResource2: Resource = {
          id: "MOCK RESOURCE 2",
        }

        const millie = new MillieJS()
        millie.registerResource(mockResource1, mockReplicaStore1)

        const mockData = jest.fn()
        const mockInputQuery: Query = {
          resource: mockResource1,
          cardinality: "many",
          attributes: {},
        }

        expect(() => {
          millie.patch(mockResource2, mockInputQuery, mockData)
        }).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe("[delete]", () => {
    it("forwards the delete call to the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockResource2: Resource = {
        id: "MOCK RESOURCE 2",
      }
      const mockReplicaStore2 = makeMockPublisherWithEvents()
      const mockIncrementalStore2 = makeMockIncrementalStore(
        mockResource2,
        mockReplicaStore2,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore2)

      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      millie.registerResource(mockResource2, mockReplicaStore2)

      const mockInputQuery: Query = {
        resource: mockResource1,
        cardinality: "many",
        attributes: {},
      }
      millie.delete(mockResource1, mockInputQuery)
      expect(mockIncrementalStore1.delete).toHaveBeenCalledWith(mockInputQuery)
      expect(mockIncrementalStore2.delete).not.toHaveBeenCalled()
    })

    it("returns the delete response from the resource's IncrementalStore", () => {
      const mockResource1: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore1 = makeMockPublisherWithEvents()
      const mockIncrementalStore1 = makeMockIncrementalStore(
        mockResource1,
        mockReplicaStore1,
      )
      jest
        .spyOn(IncrementalStoreModule, "IncrementalStore")
        .mockImplementationOnce(() => mockIncrementalStore1)

      const mockOutputEntity: Entity<Resource> = {
        id: "a",
        resource: mockResource1,
        data: {},
      }
      jest.spyOn(mockIncrementalStore1, "delete").mockResolvedValue([mockOutputEntity])

      const mockInputQuery: Query = {
        resource: mockResource1,
        cardinality: "many",
        attributes: {},
      }
      const millie = new MillieJS()
      millie.registerResource(mockResource1, mockReplicaStore1)
      expect(millie.delete(mockResource1, mockInputQuery)).resolves.toEqual([mockOutputEntity])
    })

    describe("when MillieJS has not yet registered the resource", () => {
      it("throws a helpful error", () => {
        const mockResource1: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore1 = makeMockPublisherWithEvents()
        const mockIncrementalStore1 = makeMockIncrementalStore(
          mockResource1,
          mockReplicaStore1,
        )
        jest
          .spyOn(IncrementalStoreModule, "IncrementalStore")
          .mockImplementationOnce(() => mockIncrementalStore1)

        const mockResource2: Resource = {
          id: "MOCK RESOURCE 2",
        }

        const millie = new MillieJS()
        millie.registerResource(mockResource1, mockReplicaStore1)

        const mockInputQuery: Query = {
          resource: mockResource1,
          cardinality: "many",
          attributes: {},
        }

        expect(() => {
          millie.delete(mockResource2, mockInputQuery)
        }).toThrowErrorMatchingSnapshot()
      })
    })
  })
})
