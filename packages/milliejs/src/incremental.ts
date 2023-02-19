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
      | PublisherActionInterface<R>,
  ) {
    this._replicaStore = isPublisherActionEventInterface(newReplicaStore)
      ? newReplicaStore
      : new PublisherActionEventWrapper(newReplicaStore)
  }

  private set sourcePublisher(
    newSourcePublisher:
      | PublisherActionEventInterface<R>
      | PublisherActionInterface<R>,
  ) {
    this._sourcePublisher = isPublisherActionEventInterface(newSourcePublisher)
      ? newSourcePublisher
      : new PublisherActionEventWrapper(newSourcePublisher)
  }

  private set sourceSubscriber(newSourceSubscriber: SubscriberActionInterface) {
    this._sourceSubscriber = newSourceSubscriber
  }
}

export default IncrementalStore
