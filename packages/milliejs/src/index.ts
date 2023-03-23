import type { Entity, Query, Resource } from "@milliejs/core"
import {
  PublisherActionInterface,
  SubscriberActionInterface,
  isStoreLifecycleInterface,
  StoreLifecycleInterface,
} from "@milliejs/store-base"
import invariant from "tiny-invariant"
import { IncrementalStore, StoreConstructorSourceOptions } from "./incremental"
import Worker from "./worker"

export type { Entity, Query, Resource }

class MillieJS extends Worker {
  readonly stores: Record<Resource["id"], IncrementalStore> = {}

  constructor() {
    super()
  }

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

  private storeForResource<R extends Resource>(
    resource: R,
  ): IncrementalStore<R> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.stores[resource.id] as IncrementalStore<R>
  }

  protected get connections(): Array<StoreLifecycleInterface> {
    return Object.values(this.stores).reduce<Array<StoreLifecycleInterface>>(
      (_connections, store: IncrementalStore<Resource<any>>) => {
        const storeConnections = []

        if (isStoreLifecycleInterface(store.replicaStore))
          storeConnections.push(store.replicaStore)
        if (
          store.sourcePublisher &&
          isStoreLifecycleInterface(store.sourcePublisher)
        )
          storeConnections.push(store.sourcePublisher)
        if (
          store.sourceSubscriber &&
          isStoreLifecycleInterface(store.sourceSubscriber)
        )
          storeConnections.push(store.sourceSubscriber)

        return [..._connections, ...storeConnections]
      },
      [],
    )
  }
}

export default MillieJS
