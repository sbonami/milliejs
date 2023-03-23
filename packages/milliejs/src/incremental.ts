import invariant from "tiny-invariant"
import type { Resource } from "@milliejs/core"
import type {
  PublisherActionInterface,
  SubscriberActionInterface,
} from "@milliejs/store-base"
import {
  isPublisherActionEventInterface,
  PublisherActionEventInterface,
  PublisherActionEventWrapper,
} from "./store/events"

export type StoreConstructorSourceOptions<R extends Resource> = {
  sourcePublisher?:
    | PublisherActionEventInterface<R>
    | PublisherActionInterface<R>
  sourceSubscriber?: SubscriberActionInterface
}

export class IncrementalStore<R extends Resource> {
  private _replicaStore?: PublisherActionEventInterface<R>
  private _sourcePublisher?: PublisherActionEventInterface<R>
  private _sourceSubscriber?: SubscriberActionInterface

  constructor(
    readonly resource: R,
    replicaStore:
      | PublisherActionEventInterface<R>
      | PublisherActionInterface<R>,
    sourceInterfaces?: StoreConstructorSourceOptions<R>,
  ) {
    this.replicaStore = replicaStore

    if (sourceInterfaces?.sourcePublisher)
      this.sourcePublisher = sourceInterfaces.sourcePublisher

    if (sourceInterfaces?.sourceSubscriber)
      this.sourceSubscriber = sourceInterfaces.sourceSubscriber
  }

  private set replicaStore(
    newReplicaStore:
      | PublisherActionEventInterface<R>
      | PublisherActionInterface<R>
      | undefined,
  ) {
    invariant(
      typeof newReplicaStore !== "undefined",
      "Replica store cannot be unset",
    )

    this._replicaStore = isPublisherActionEventInterface(newReplicaStore)
      ? newReplicaStore
      : new PublisherActionEventWrapper(newReplicaStore)
  }

  get replicaStore() {
    return this._replicaStore
  }

  set sourcePublisher(
    newSourcePublisher:
      | PublisherActionEventInterface<R>
      | PublisherActionInterface<R>
      | undefined,
  ) {
    if (typeof newSourcePublisher === "undefined") {
      this._sourcePublisher = undefined
    } else {
      this._sourcePublisher = isPublisherActionEventInterface(
        newSourcePublisher,
      )
        ? newSourcePublisher
        : new PublisherActionEventWrapper(newSourcePublisher)
    }
  }

  get sourcePublisher() {
    return this._sourcePublisher
  }

  set sourceSubscriber(
    newSourceSubscriber: SubscriberActionInterface | undefined,
  ) {
    if (typeof newSourceSubscriber === "undefined") {
      this._sourceSubscriber = undefined
    } else {
      this._sourceSubscriber = newSourceSubscriber
    }
  }

  get sourceSubscriber() {
    return this._sourceSubscriber
  }
}

export default IncrementalStore
