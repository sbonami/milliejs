import type { Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import type { StoreConstructorSourceOptions } from "../../../src/incremental"
import type { PublisherActionEventInterface } from "../../../src/store/events"

const { IncrementalStore: MockIncrementalStore } = jest.createMockFromModule<
  typeof import("../../../src/incremental")
>("../../../src/incremental")

export const makeMockIncrementalStore = <R extends Resource>(
  resource: R,
  replicaStore: PublisherActionEventInterface<R> | PublisherActionInterface<R>,
  sourceInterfaces?: StoreConstructorSourceOptions<R>,
) => {
  return new MockIncrementalStore(resource, replicaStore, sourceInterfaces)
}
