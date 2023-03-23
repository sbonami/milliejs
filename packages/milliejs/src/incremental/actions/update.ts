import type { Entity, Query, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import { ActionBase } from "./mixin"

export class UpdateAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "update">
{
  update(
    entityOrQuery: Entity<R> | Query,
    data: Entity<R>["data"],
  ): Promise<Entity<R>[]> {
    throw new Error("Not Implemented")
  }
}
