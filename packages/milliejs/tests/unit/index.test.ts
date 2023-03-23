import type { Resource } from "@milliejs/core"
import { IncrementalStore } from "../../src/incremental"
import MillieJS from "../../src/index"
import { makeMockPublisherWithEvents } from "./mocks/publisher"
import { makeMockSubscriber } from "./mocks/subscriber"

jest.mock("../../src/incremental")

describe("MillieJS", () => {
  describe("registerResource", () => {
    it("generates a new IncrementalStore for the resource", () => {
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()

      const millie = new MillieJS()
      millie.registerResource(mockResource, mockReplicaStore)

      // const spy = jest.spyOn(IncrementalStore, "prototype")

      expect(IncrementalStore).toHaveBeenCalledWith(mockResource, mockReplicaStore)
    })

    describe("when the resource is registered with a source publisher", () => {
      it("registers the source publisher for the resource", () => {
        const mockResource: Resource = {
          id: "MOCK RESOURCE",
        }
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()

        const millie = new MillieJS()
        const spy = jest.spyOn(millie, 'registerSourcePublisher')

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

        const millie = new MillieJS()
        const spy = jest.spyOn(millie, 'registerSourceSubscriber')

        millie.registerResource(mockResource, mockReplicaStore, {
          sourceSubscriber: mockSourceSubscriber,
        })
        expect(spy).toHaveBeenCalledWith(mockResource, mockSourceSubscriber)
      })
    })

    it("returns the resource's IncrementalStore", () => {
      const MockedIncrementalStore = jest.mocked(IncrementalStore)
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockIncrementalStore = new IncrementalStore(mockResource, mockReplicaStore)
      MockedIncrementalStore.mockReturnValueOnce(mockIncrementalStore as any)

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

      const MockedIncrementalStore = jest.mocked(IncrementalStore)
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockIncrementalStore = new IncrementalStore(mockResource, mockReplicaStore)
      MockedIncrementalStore.mockReturnValueOnce(mockIncrementalStore as any)

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
        }
      })
      millie.registerSourcePublisher(mockResource, mockSourcePublisher)
    })

    it("returns the resource's IncrementalStore", () => {
      const MockedIncrementalStore = jest.mocked(IncrementalStore)
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockIncrementalStore = new IncrementalStore(mockResource, mockReplicaStore)
      MockedIncrementalStore.mockReturnValueOnce(mockIncrementalStore as any)

      const millie = new MillieJS()
      millie.registerResource(mockResource, mockReplicaStore)

      const response = millie.registerSourcePublisher(mockResource, mockSourcePublisher)
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

      const MockedIncrementalStore = jest.mocked(IncrementalStore)
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const mockIncrementalStore = new IncrementalStore(mockResource, mockReplicaStore)
      MockedIncrementalStore.mockReturnValueOnce(mockIncrementalStore as any)

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
        }
      })
      millie.registerSourceSubscriber(mockResource, mockSourceSubscriber)
    })

    it("returns the resource's IncrementalStore", () => {
      const MockedIncrementalStore = jest.mocked(IncrementalStore)
      const mockResource: Resource = {
        id: "MOCK RESOURCE",
      }
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const mockIncrementalStore = new IncrementalStore(mockResource, mockReplicaStore)
      MockedIncrementalStore.mockReturnValueOnce(mockIncrementalStore as any)

      const millie = new MillieJS()
      millie.registerResource(mockResource, mockReplicaStore)

      const response = millie.registerSourceSubscriber(mockResource, mockSourceSubscriber)
      expect(response).toBe(mockIncrementalStore)
    })
  })
})
