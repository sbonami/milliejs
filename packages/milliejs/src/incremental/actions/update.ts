import type { Entity, Query, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import invariant from "tiny-invariant"
import { ActionBase } from "./mixin"

export class UpdateAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "update">
{
  async update(
    entityOrQuery: Entity<R> | Query,
    data: Entity<R>["data"],
  ): Promise<Entity<R>[]> {
    invariant(this.store.replicaStore, "Replica Store cannot be undefined")

    // optimistic into replicaStore
    const entities = this.store.replicaStore.update(entityOrQuery, data)

    // to source
    await this.store.sourcePublisher?.update(entityOrQuery, data)

    return entities
  }
}
