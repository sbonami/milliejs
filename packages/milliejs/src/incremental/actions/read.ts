import type { Entity, Query, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import { ActionBase } from "./mixin"

export class ReadAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "read">
{
  read(query: Query, track = true): Promise<Entity<R>[]> {
    throw new Error("Not Implemented")
  }
}
