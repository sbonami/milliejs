import type { Entity, Resource } from "@milliejs/core"
import { makeMockEntity, makeMockResource } from "@milliejs/jest-utils"
import { LifecycleEvents } from "@milliejs/store-base"
import { IncrementalStore } from "../../../src/incremental"
import { replicaEventPulldown } from "../../../src/incremental/replicaEventPulldown"
import { makeMockPublisherWithEvents } from "../mocks/publisher"
import { makeMockSubscriber } from "../mocks/subscriber"

type MockResource = Resource
const mockResource = makeMockResource()
const mockReplicaStore = makeMockPublisherWithEvents()
const mockSubscriber = makeMockSubscriber()

jest.mock("../../../src/incremental", () => ({
  IncrementalStore: function () {
    return {
      get resource() {
        return mockResource
      },
      get replicaStore() {
        return mockReplicaStore
      },
      get sourceSubscriber() {
        return mockSubscriber
      },
    }
  },
}))

describe("replicaEventPulldown", () => {
  let mockStore: IncrementalStore<MockResource>
  beforeEach(() => {
    mockStore = new IncrementalStore<MockResource>(
      mockResource,
      mockReplicaStore,
      {
        sourceSubscriber: mockSubscriber,
      },
    )

    replicaEventPulldown(mockStore, mockSubscriber)
  })
  afterEach(() => {
    mockSubscriber.removeAllListeners()
  })

  describe(`when the store emits a '${LifecycleEvents.Save}' event`, () => {
    describe("when the store's resource and the event's resource do not match", () => {
      it("throws an error", (done) => {
        expect.assertions(1)

        const mockEntity = makeMockEntity()

        mockSubscriber.on("error", (error: Error) => {
          try {
            expect(error).toHaveProperty(
              "message",
              expect.stringContaining(
                "Subscriber Resource is for another Incremental Store",
              ),
            )
            done()
          } catch (error) {
            done(error)
          }
        })

        mockSubscriber.emit(LifecycleEvents.Save, mockEntity)
      })
    })

    describe("when the store does not have a replica store", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "replicaStore", "get").mockReturnValue(undefined)
      })

      it("throws an error", (done) => {
        expect.assertions(1)

        const mockEntity = makeMockEntity({
          resource: mockResource,
        })

        mockSubscriber.on("error", (error: Error) => {
          try {
            expect(error).toHaveProperty(
              "message",
              expect.stringContaining("Replica store cannot be undefined"),
            )
            done()
          } catch (error) {
            done(error)
          }
        })

        mockSubscriber.emit(LifecycleEvents.Save, mockEntity)
      })
    })

    it("forwards the created entity to the replicaStore", (done) => {
      expect.assertions(1)

      const mockEntity = makeMockEntity({
        resource: mockResource,
      })

      mockSubscriber.on(LifecycleEvents.Save, (...args: any[]) => {
        try {
          expect(mockReplicaStore.create).toHaveBeenCalledWith(mockEntity)
          done()
        } catch (error) {
          done(error)
        }
      })

      mockSubscriber.emit(LifecycleEvents.Save, mockEntity)
    })
  })

  describe(`when the store emits a '${LifecycleEvents.Delete}' event`, () => {
    describe("when the store does not have a replica store", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "replicaStore", "get").mockReturnValue(undefined)
      })

      it("throws an error", (done) => {
        expect.assertions(1)

        const mockEntity = makeMockEntity({
          resource: mockResource,
        })

        mockSubscriber.on("error", (error: Error) => {
          try {
            expect(error).toHaveProperty(
              "message",
              expect.stringContaining("Replica store cannot be undefined"),
            )
            done()
          } catch (error) {
            done(error)
          }
        })

        mockSubscriber.emit(LifecycleEvents.Delete, mockEntity)
      })
    })

    it("forwards the deleted entity to the replicaStore", (done) => {
      expect.assertions(1)

      const mockEntity = makeMockEntity({
        resource: mockResource,
      })

      mockSubscriber.on(LifecycleEvents.Delete, (...args: any[]) => {
        try {
          expect(mockReplicaStore.delete).toHaveBeenCalledWith(mockEntity)
          done()
        } catch (error) {
          done(error)
        }
      })

      mockSubscriber.emit(LifecycleEvents.Delete, mockEntity)
    })
  })
})
