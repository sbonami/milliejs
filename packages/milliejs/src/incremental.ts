import { EventEmitter } from "node:events"
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
import { CreateAction } from "./incremental/actions/create"
import { ReadAction } from "./incremental/actions/read"
import { UpdateAction } from "./incremental/actions/update"
import { PatchAction } from "./incremental/actions/patch"
import { DeleteAction } from "./incremental/actions/delete"
import { deltaEventForwarder } from "./incremental/deltaEventForwarder"
import { replicaEventPulldown } from "./incremental/replicaEventPulldown"

export type StoreConstructorSourceOptions<R extends Resource> = {
  sourcePublisher?:
    | PublisherActionEventInterface<R>
    | PublisherActionInterface<R>
  sourceSubscriber?: SubscriberActionInterface
}

export class IncrementalStore<R extends Resource = Resource>
  extends EventEmitter
  implements PublisherActionEventInterface<R>
{
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
    super()

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

    deltaEventForwarder(this, this._replicaStore)
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

      deltaEventForwarder(this, this._sourcePublisher)
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
      deltaEventForwarder(this, this._sourceSubscriber)
      replicaEventPulldown(this, this._sourceSubscriber)
    }
  }

  get sourceSubscriber() {
    return this._sourceSubscriber
  }

  /**
   * Delegated Publisher Actions
   **/

  create(
    ...args: Parameters<CreateAction<R>["create"]>
  ): ReturnType<CreateAction<R>["create"]> {
    return new CreateAction(this).create(...args)
  }

  read(
    ...args: Parameters<ReadAction<R>["read"]>
  ): ReturnType<ReadAction<R>["read"]> {
    return new ReadAction(this).read(...args)
  }

  update(
    ...args: Parameters<UpdateAction<R>["update"]>
  ): ReturnType<UpdateAction<R>["update"]> {
    return new UpdateAction(this).update(...args)
  }

  patch(
    ...args: Parameters<PatchAction<R>["patch"]>
  ): ReturnType<PatchAction<R>["patch"]> {
    return new PatchAction(this).patch(...args)
  }

  delete(
    ...args: Parameters<DeleteAction<R>["delete"]>
  ): ReturnType<DeleteAction<R>["delete"]> {
    return new DeleteAction(this).delete(...args)
  }
}

export default IncrementalStore
