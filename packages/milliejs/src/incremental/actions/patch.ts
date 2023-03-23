import type { Entity, Query, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import { ActionBase } from "./mixin"

export class PatchAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "patch">
{
  patch(entityOrQuery: Entity<R> | Query, patch: any): Promise<Entity<R>[]> {
    throw new Error("Not Implemented")
  }
}
