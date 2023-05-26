import type { Entity, Query, Resource } from "@milliejs/core"

type MaybeAsync<T> = T | Promise<T>

export interface PublisherActionInterface<R extends Resource> {
  create(entity: Entity<R>): MaybeAsync<Entity<R>>
  read(query: Query): MaybeAsync<Entity<R>[]>
  update(
    entityOrQuery: Entity<R> | Query,
    data: Entity<R>["data"],
  ): MaybeAsync<Entity<R>[]>
  patch(entityOrQuery: Entity<R> | Query, patch: any): MaybeAsync<Entity<R>[]>
  delete(entityOrQuery: Entity<R> | Query): MaybeAsync<Entity<R>[] | boolean>
}

export function isPublisherActionInterface<R extends Resource>(
  interfaceOrUnknown: PublisherActionInterface<R> | unknown,
): interfaceOrUnknown is PublisherActionInterface<R> {
  return !!(
    typeof (interfaceOrUnknown as PublisherActionInterface<R>).create !==
      "undefined" &&
    typeof (interfaceOrUnknown as PublisherActionInterface<R>).read !==
      "undefined" &&
    typeof (interfaceOrUnknown as PublisherActionInterface<R>).update !==
      "undefined" &&
    typeof (interfaceOrUnknown as PublisherActionInterface<R>).patch !==
      "undefined" &&
    typeof (interfaceOrUnknown as PublisherActionInterface<R>).delete !==
      "undefined"
  )
}
