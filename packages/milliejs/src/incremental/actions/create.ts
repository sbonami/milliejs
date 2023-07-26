import type { Entity, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import invariant from "tiny-invariant"
import { ActionBase } from "./mixin"

export class CreateAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "create">
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Entity<R>["data"], track = true): Promise<Entity<R>> {
    invariant(this.store.replicaStore, "Replica Store cannot be undefined")

    // optimistic into replicaStore
    const entity = this.store.replicaStore.create(data)

    // to source
    await this.store.sourcePublisher?.create(data)

    return entity
  }
}
