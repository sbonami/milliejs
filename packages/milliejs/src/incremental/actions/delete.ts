import type { Entity, Query, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import { ActionBase } from "./mixin"

export class DeleteAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "delete">
{
  delete(entityOrQuery: Entity<R> | Query): Promise<Entity<R>[] | boolean> {
    throw new Error("Not Implemented")
  }
}
