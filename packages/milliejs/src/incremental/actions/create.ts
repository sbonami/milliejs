import type { Entity, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import { ActionBase } from "./mixin"

export class CreateAction<R extends Resource>
  extends ActionBase
  implements Pick<PublisherActionInterface<R>, "create">
{
  create(data: Entity<R>["data"], track = true): Promise<Entity<R>> {
    throw new Error("Not Implemented")
  }
}
