import type { Entity, Query, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import invariant from "tiny-invariant"
import { ActionBase } from "./mixin"

export class ReadAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "read">
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async read(query: Query, track = true): Promise<Entity<R>[]> {
    invariant(this.store.replicaStore, "Replica Store cannot be undefined")

    // optimistic into replicaStore
    const entities = this.store.replicaStore.read(query)

    // to source
    await this.store.sourcePublisher?.read(query)

    return entities
  }
}
