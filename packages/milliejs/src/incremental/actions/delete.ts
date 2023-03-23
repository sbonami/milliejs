import type { Entity, Query, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import invariant from "tiny-invariant"
import { ActionBase } from "./mixin"

export class DeleteAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "delete">
{
  async delete(
    entityOrQuery: Entity<R> | Query,
  ): Promise<Entity<R>[] | boolean> {
    invariant(this.store.replicaStore, "Replica Store cannot be undefined")

    // optimistic into replicaStore
    this.store.replicaStore.delete(entityOrQuery)

    // to source
    await this.store.sourcePublisher?.delete(entityOrQuery)

    return true
  }
}
