import type { Entity, Resource } from "@milliejs/core"
import { LifecycleEvents } from "@milliejs/store-base"
import type { IncrementalStore } from "../incremental"
import type { PublisherActionEventInterface } from "../store/events"

export const replicaEventForwarder = <R extends Resource = Resource>(
  incrementalStore: IncrementalStore<R>,
  replicaStore: PublisherActionEventInterface<R>,
) => {
  Object.values(LifecycleEvents).forEach((event) => {
    replicaStore?.on(event, (entity: Entity<R>) => {
      incrementalStore.emit(event, incrementalStore.resource, entity)
    })
  })
}
