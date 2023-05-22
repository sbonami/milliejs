import type { Entity, Query, Resource } from "@milliejs/core"
import {
  LifecycleEvents,
  PublisherActionInterface,
  SubscriberActionInterface,
  isStoreLifecycleInterface,
  StoreLifecycleInterface,
} from "@milliejs/store-base"
import invariant from "tiny-invariant"
import { IncrementalStore, StoreConstructorSourceOptions } from "./incremental"
import Worker from "./worker"

export { LifecycleEvents }
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

  /**
   * Worker configuration
   **/

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

  /**
   * Delegated Incremental Store Actions
   **/

  create<R extends Resource>(
    resource: R,
    ...args: Parameters<IncrementalStore<R>["create"]>
  ): ReturnType<IncrementalStore<R>["create"]> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.storeForResource<R>(resource).create(...args)
  }

  read<R extends Resource>(
    resource: R,
    ...args: Parameters<IncrementalStore<R>["read"]>
  ): ReturnType<IncrementalStore<R>["read"]> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )
    invariant(args[0].resource === resource, "Query resource does not match")

    return this.storeForResource<R>(resource).read(...args)
  }

  update<R extends Resource>(
    resource: R,
    ...args: Parameters<IncrementalStore<R>["update"]>
  ): ReturnType<IncrementalStore<R>["update"]> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.storeForResource<R>(resource).update(...args)
  }

  patch<R extends Resource>(
    resource: R,
    ...args: Parameters<IncrementalStore<R>["patch"]>
  ): ReturnType<IncrementalStore<R>["patch"]> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.storeForResource<R>(resource).patch(...args)
  }

  delete<R extends Resource>(
    resource: R,
    ...args: Parameters<IncrementalStore<R>["delete"]>
  ): ReturnType<IncrementalStore<R>["delete"]> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.storeForResource<R>(resource).delete(...args)
  }

  /**
   * Delegated Incremental Store Listeners
   **/

  on<R extends Resource>(
    resource: R,
    ...args: Parameters<IncrementalStore<R>["on"]>
  ): ReturnType<IncrementalStore<R>["on"]> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.storeForResource<R>(resource).on(...args)
  }

  addListener<R extends Resource>(
    resource: R,
    ...args: Parameters<IncrementalStore<R>["addListener"]>
  ): ReturnType<IncrementalStore<R>["addListener"]> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.storeForResource<R>(resource).addListener(...args)
  }

  once<R extends Resource>(
    resource: R,
    ...args: Parameters<IncrementalStore<R>["once"]>
  ): ReturnType<IncrementalStore<R>["once"]> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.storeForResource<R>(resource).once(...args)
  }

  off<R extends Resource>(
    resource: R,
    ...args: Parameters<IncrementalStore<R>["off"]>
  ): ReturnType<IncrementalStore<R>["off"]> {
    invariant(
      this.stores[resource.id],
      "Resource is not registered with this store",
    )

    return this.storeForResource<R>(resource).off(...args)
  }
}

export default MillieJS
