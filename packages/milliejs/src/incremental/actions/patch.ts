import type { Entity, Query, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import invariant from "tiny-invariant"
import { ActionBase } from "./mixin"

export class PatchAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "patch">
{
  async patch(
    entityOrQuery: Entity<R> | Query,
    patch: any,
  ): Promise<Entity<R>[]> {
    invariant(this.store.replicaStore, "Replica Store cannot be undefined")

    // optimistic into replicaStore
    const entities = this.store.replicaStore.patch(entityOrQuery, patch)

    // to source
    await this.store.sourcePublisher?.patch(entityOrQuery, patch)

    return entities
  }
}
