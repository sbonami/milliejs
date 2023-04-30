import invariant from "tiny-invariant"
import type { Entity, Resource } from "@milliejs/core"
import {
  LifecycleEvents,
  SubscriberActionInterface,
} from "@milliejs/store-base"
import type { IncrementalStore } from "../incremental"
import type { PublisherActionEventInterface } from "../store/events"

export const deltaEventForwarder = <R extends Resource = Resource>(
  incrementalStore: IncrementalStore<R>,
  store: PublisherActionEventInterface<R> | SubscriberActionInterface,
) => {
  store.on(LifecycleEvents.Save, (entity: Entity<R>) => {
    try {
      invariant(
        incrementalStore.resource.id === entity.resource.id,
        "Subscriber Resource is for another Incremental Store",
      )
      incrementalStore.emit(
        LifecycleEvents.Save,
        incrementalStore.resource,
        entity,
      )
      incrementalStore.emit(
        LifecycleEvents.Delta,
        incrementalStore.resource,
        entity,
      )
    } catch (error) {
      store.emit("error", error)
    }
  })
  store.on(LifecycleEvents.Delete, (entity: Entity<R>) => {
    try {
      invariant(
        incrementalStore.resource.id === entity.resource.id,
        "Subscriber Resource is for another Incremental Store",
      )
      incrementalStore.emit(
        LifecycleEvents.Delete,
        incrementalStore.resource,
        entity,
      )
      incrementalStore.emit(
        LifecycleEvents.Delta,
        incrementalStore.resource,
        entity,
      )
    } catch (error) {
      store.emit("error", error)
    }
  })
}
