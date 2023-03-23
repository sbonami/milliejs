import type { Entity, Query, Resource } from "@milliejs/core"
import type {
  PublisherActionInterface,
  SubscriberActionInterface,
} from "@milliejs/store-base"
import invariant from "tiny-invariant"
import { IncrementalStore, StoreConstructorSourceOptions } from "./incremental"

export type { Entity, Query, Resource }

class MillieJS {
  readonly stores: Record<Resource["id"], IncrementalStore> = {}

  registerResource<R extends Resource>(
    resource: R,
    replicaStore: PublisherActionInterface<R>,
    sourceInterfaces?: StoreConstructorSourceOptions<R>,
  ): IncrementalStore<R> {
    this.stores[resource.id] = new IncrementalStore<R>(resource, replicaStore)

    if (sourceInterfaces?.sourcePublisher)
      this.registerSourcePublisher(resource, sourceInterfaces.sourcePublisher)

    if (sourceInterfaces?.sourceSubscriber)
      this.registerSourceSubscriber(resource, sourceInterfaces.sourceSubscriber)

    return this.storeForResource<R>(resource)
  }

  registerSourcePublisher<R extends Resource>(
    resource: R,
    store: PublisherActionInterface<R>,
  ): IncrementalStore<R> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    this.stores[resource.id].sourcePublisher = store
    return this.storeForResource<R>(resource)
  }

  registerSourceSubscriber<R extends Resource>(
    resource: R,
    store: SubscriberActionInterface,
  ): IncrementalStore<R> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    this.stores[resource.id].sourceSubscriber = store
    return this.storeForResource<R>(resource)
  }

  private storeForResource<R extends Resource>(resource: R): IncrementalStore<R> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.stores[resource.id] as IncrementalStore<R>
  }
}

export default MillieJS
