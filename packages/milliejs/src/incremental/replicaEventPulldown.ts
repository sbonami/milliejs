import invariant from "tiny-invariant"
import type { Entity, Query, Resource } from "@milliejs/core"
import { LifecycleEvents, SubscriberActionInterface } from "@milliejs/store-base"
import type { IncrementalStore } from "../incremental"

export const replicaEventPulldown = <R extends Resource = Resource>(
  incrementalStore: IncrementalStore<R>,
  store: SubscriberActionInterface,
) => {
  store.on(LifecycleEvents.Save, async (entity: Entity<R>) => {
    try {
      invariant(
        typeof incrementalStore.replicaStore !== "undefined",
        "Replica store cannot be undefined",
      )
      invariant(
        incrementalStore.resource.id === entity.resource.id,
        "Subscriber Resource is for another Incremental Store",
      )

      await incrementalStore.replicaStore.create(entity)
    } catch (error) {
      store.emit("error", error)
    }
  })

  store.on(LifecycleEvents.Delete, async (entityOrQuery: Entity<R> | Query) => {
    try {
      invariant(
        typeof incrementalStore.replicaStore !== "undefined",
        "Replica store cannot be undefined",
      )

      await incrementalStore.replicaStore.delete(entityOrQuery)
    } catch (error) {
      store.emit("error", error)
    }
  })
}
