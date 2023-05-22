import { EventEmitter } from "node:events"
import type { Resource } from "@milliejs/core"
import { makeMockEntity, makeMockResource } from "@milliejs/jest-utils"
import { LifecycleEvents } from "@milliejs/store-base"
import { IncrementalStore } from "../../../src/incremental"
import { replicaEventForwarder } from "../../../src/incremental/replicaEventForwarder"
import type { PublisherActionEventInterface } from "../../../src/store/events"

type MockResource = Resource
const mockResource = makeMockResource()
const mockReplicaStore =
  new EventEmitter() as PublisherActionEventInterface<MockResource>
const mockEntity = makeMockEntity()

jest.mock("../../../src/incremental", () => ({
  IncrementalStore: function () {
    return {
      get resource() {
        return mockResource
      },
      get replicaStore() {
        return mockReplicaStore
      },
      emit: jest.fn(),
    }
  },
}))

describe("replicaEventForwarder", () => {
  let mockStore: IncrementalStore<MockResource>
  beforeEach(() => {
    mockStore = new IncrementalStore<MockResource>(
      mockResource,
      mockReplicaStore,
    )

    replicaEventForwarder(mockStore, mockReplicaStore)
  })

  describe.each<[(typeof LifecycleEvents)[keyof typeof LifecycleEvents]]>([
    [LifecycleEvents.Save],
    [LifecycleEvents.Delta],
    [LifecycleEvents.Delete],
  ])("when the replicaStore emits a %s event", (event) => {
    it("re-emits the event from the incremental store", () => {
      const spy = jest.spyOn(mockStore, "emit")

      mockReplicaStore.emit(event, mockEntity)

      expect(spy).toHaveBeenCalledWith(event, mockResource, mockEntity)
    })
  })
})
