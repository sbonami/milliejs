import type { Resource } from "@milliejs/core"
import { IncrementalStore } from "../../src/incremental"
import * as events from "../../src/store/events"
import {
  makeMockPublisher,
  makeMockPublisherWithEvents,
} from "./mocks/publisher"
import { makeMockSubscriber } from "./mocks/subscriber"

type MockResource = Resource

describe("IncrementalStore", () => {
  describe("new IncrementalStore", () => {
    it("should create an instance of IncrementalStore", () => {
      const mockResource: MockResource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisher()

      const store = new IncrementalStore<MockResource>(
        mockResource,
        mockReplicaStore,
        {
          sourcePublisher: makeMockPublisher(),
          sourceSubscriber: makeMockSubscriber(),
        },
      )

      expect(store).toBeInstanceOf(IncrementalStore)
      expect(store.resource).toBe(mockResource)
    })

    describe("when the store is instantiated without the sourceInterface options", () => {
      it("should create an instance of IncrementalStore with undefined sourceInterfaces", () => {
        const mockResource: MockResource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore = makeMockPublisher()

        const store = new IncrementalStore(mockResource, mockReplicaStore)

        expect(store).toBeInstanceOf(IncrementalStore)
        expect(store.resource).toBe(mockResource)
        expect(store["sourcePublisher"]).toBeUndefined()
        expect(store["sourceSubscriber"]).toBeUndefined()
      })
    })

    describe("[replicaStore]", () => {
      describe("when the provided replicaStore is also an event interface", () => {
        it("should set the replicaStore directly", () => {
          const mockResource: MockResource = {
            id: "MOCK RESOURCE",
          }
          const mockReplicaStore = makeMockPublisherWithEvents()

          const store = new IncrementalStore(mockResource, mockReplicaStore)

          expect(store["_replicaStore"]).toBe(mockReplicaStore)
        })
      })

      describe("when the provided replicaStore does not provide an event interface", () => {
        it("should set the replicaStore wrapped by the PublisherActionEventWrapper", () => {
          const mockResource: MockResource = {
            id: "MOCK RESOURCE",
          }
          const mockReplicaStore = makeMockPublisher()
          const mockWrappedReplicaStore =
            makeMockPublisherWithEvents() as unknown as jest.Mocked<
              events.PublisherActionEventWrapper<MockResource>
            >
          const wrapperSpy = jest
            .spyOn(events, "PublisherActionEventWrapper")
            .mockReturnValue(mockWrappedReplicaStore)

          const store = new IncrementalStore(mockResource, mockReplicaStore)

          expect(wrapperSpy).toHaveBeenCalledWith(mockReplicaStore)
          expect(store["_replicaStore"]).toBe(mockWrappedReplicaStore)
        })
      })
    })

    describe("[sourcePublisher]", () => {
      describe("when the store is instantiated with only the sourcePublisher interface option", () => {
        describe("when the provided sourcePublisher is also an event interface", () => {
          it("should create an instance of IncrementalStore with the sourcePublisher", () => {
            const mockResource: MockResource = {
              id: "MOCK RESOURCE",
            }
            const mockReplicaStore = makeMockPublisherWithEvents()
            const mockSourcePublisher = makeMockPublisherWithEvents()

            const store = new IncrementalStore(mockResource, mockReplicaStore, {
              sourcePublisher: mockSourcePublisher,
            })

            expect(store).toBeInstanceOf(IncrementalStore)
            expect(store.resource).toBe(mockResource)
            expect(store["_replicaStore"]).toBe(mockReplicaStore)
            expect(store["_sourcePublisher"]).toBe(mockSourcePublisher)
            expect(store["_sourceSubscriber"]).toBeUndefined()
          })
        })

        describe("when the provided sourcePublisher does not provide an event interface", () => {
          it("should create an instance of IncrementalStore with the sourcePublisher wrapped by the PublisherActionEventWrapper", () => {
            const mockResource: MockResource = {
              id: "MOCK RESOURCE",
            }
            const mockReplicaStore = makeMockPublisherWithEvents()
            const mockSourcePublisher = makeMockPublisher()
            const mockWrappedSourcePublisher =
              makeMockPublisherWithEvents() as unknown as jest.Mocked<
                events.PublisherActionEventWrapper<MockResource>
              >
            const wrapperSpy = jest
              .spyOn(events, "PublisherActionEventWrapper")
              .mockReturnValue(mockWrappedSourcePublisher)

            const store = new IncrementalStore(mockResource, mockReplicaStore, {
              sourcePublisher: mockSourcePublisher,
            })

            expect(wrapperSpy).toHaveBeenCalledWith(mockSourcePublisher)
            expect(store["_sourcePublisher"]).toBe(mockWrappedSourcePublisher)
          })
        })
      })
    })

    describe("[sourceSubscriber]", () => {
      describe("when the store is instantiated with only the sourceSubscriber interface option", () => {
        it("should create an instance of IncrementalStore with only sourceSubscriber", () => {
          const mockResource: MockResource = {
            id: "MOCK RESOURCE",
          }
          const mockReplicaStore = makeMockPublisherWithEvents()
          const mockSourceSubscriber = makeMockSubscriber()

          const store = new IncrementalStore(mockResource, mockReplicaStore, {
            sourceSubscriber: mockSourceSubscriber,
          })

          expect(store).toBeInstanceOf(IncrementalStore)
          expect(store.resource).toBe(mockResource)
          expect(store["_replicaStore"]).toBe(mockReplicaStore)
          expect(store["_sourcePublisher"]).toBeUndefined()
          expect(store["_sourceSubscriber"]).toBe(mockSourceSubscriber)
        })
      })
    })
  })

  describe("get [replicaStore]", () => {
    it("returns the IncrementalStore's _replicaStore", () => {
      const mockResource: MockResource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourcePublisher: mockSourcePublisher,
        sourceSubscriber: mockSourceSubscriber,
      })

      expect(store.replicaStore).toBe(store["_replicaStore"])
    })
  })

  describe("set [sourcePublisher]", () => {
    describe("when the new sourcePublisher is undefined", () => {
      it("updates the Incremental Store's _sourcePublisher to undefined", () => {
        const mockResource: MockResource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()
        const mockSourceSubscriber = makeMockSubscriber()
        const store = new IncrementalStore(mockResource, mockReplicaStore, {
          sourcePublisher: mockSourcePublisher,
          sourceSubscriber: mockSourceSubscriber,
        })

        store.sourcePublisher = undefined

        expect(store["_sourcePublisher"]).toBeUndefined()
      })
    })

    describe("when the new sourcePublisher is also an event interface", () => {
      it("updates the Incremental Store's _sourcePublisher to the provided sourcePublisher", () => {
        const mockResource: MockResource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()
        const mockSourceSubscriber = makeMockSubscriber()
        const store = new IncrementalStore(mockResource, mockReplicaStore, {
          sourcePublisher: mockSourcePublisher,
          sourceSubscriber: mockSourceSubscriber,
        })

        const newSourcePublisher = makeMockPublisherWithEvents()
        store.sourcePublisher = newSourcePublisher

        expect(store["_sourcePublisher"]).toBe(newSourcePublisher)
      })
    })

    describe("when the new sourcePublisher does not provide an event interface", () => {
      it("updates the Incremental Store's _sourcePublisher to the sourcePublisher wrapped by the PublisherActionEventWrapper", () => {
        const mockResource: MockResource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()
        const mockSourceSubscriber = makeMockSubscriber()
        const store = new IncrementalStore(mockResource, mockReplicaStore, {
          sourcePublisher: mockSourcePublisher,
          sourceSubscriber: mockSourceSubscriber,
        })
        const mockWrappedSourcePublisher =
          makeMockPublisherWithEvents() as unknown as jest.Mocked<
            events.PublisherActionEventWrapper<MockResource>
          >
        const wrapperSpy = jest
          .spyOn(events, "PublisherActionEventWrapper")
          .mockReturnValue(mockWrappedSourcePublisher)

        const newSourcePublisher = makeMockPublisher()
        store.sourcePublisher = newSourcePublisher

        expect(wrapperSpy).toHaveBeenCalledWith(newSourcePublisher)
        expect(store["_sourcePublisher"]).toBe(mockWrappedSourcePublisher)
      })
    })
  })

  describe("get [sourcePublisher]", () => {
    it("returns the IncrementalStore's _sourcePublisher", () => {
      const mockResource: MockResource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourcePublisher: mockSourcePublisher,
        sourceSubscriber: mockSourceSubscriber,
      })

      expect(store.sourcePublisher).toBe(store["_sourcePublisher"])
    })
  })

  describe("set [sourceSubscriber]", () => {
    it("updates the Incremental Store's _sourceSubscriber", () => {
      const mockResource: MockResource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourcePublisher: mockSourcePublisher,
        sourceSubscriber: mockSourceSubscriber,
      })

      const newSourceSubscriber = makeMockSubscriber()
      store.sourceSubscriber = newSourceSubscriber

      expect(store["_sourceSubscriber"]).toBe(newSourceSubscriber)
    })

    describe("when the new sourceSubscriber is undefined", () => {
      it("updates the Incremental Store's _sourceSubscriber to undefined", () => {
        const mockResource: MockResource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()
        const mockSourceSubscriber = makeMockSubscriber()
        const store = new IncrementalStore(mockResource, mockReplicaStore, {
          sourcePublisher: mockSourcePublisher,
          sourceSubscriber: mockSourceSubscriber,
        })

        store.sourceSubscriber = undefined

        expect(store["_sourceSubscriber"]).toBeUndefined()
      })
    })
  })

  describe("get [sourceSubscriber]", () => {
    it("returns the IncrementalStore's _sourceSubscriber", () => {
      const mockResource: MockResource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourcePublisher: mockSourcePublisher,
        sourceSubscriber: mockSourceSubscriber,
      })

      expect(store.sourceSubscriber).toBe(store["_sourceSubscriber"])
    })
  })
})
