import type { Resource, ResourceDataType } from "./resource"

export type Entity<R extends Resource> = {
  id: string
  resource: Pick<Resource, "id">
  data: ResourceDataType<R>
}

export function isEntity<R extends Resource>(
  entityOrAny: Entity<R> | any,
): entityOrAny is Entity<R> {
  return !!(
    typeof (entityOrAny as Entity<R>).id !== "undefined" &&
    typeof (entityOrAny as Entity<R>).resource !== "undefined" &&
    typeof (entityOrAny as Entity<R>).resource.id !== "undefined"
  )
}
