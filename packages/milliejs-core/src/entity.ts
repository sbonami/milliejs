import type { Resource, ResourceDataType } from "./resource"

export type Entity<R extends Resource> = {
  id: string
  resource: Pick<Resource, "id">
  data: ResourceDataType<R>
}

export function isEntity<R extends Resource>(
  entityOrUnknown: Entity<R> | unknown,
): entityOrUnknown is Entity<R> {
  return !!(
    typeof (entityOrUnknown as Entity<R>).id !== "undefined" &&
    typeof (entityOrUnknown as Entity<R>).resource !== "undefined" &&
    typeof (entityOrUnknown as Entity<R>).resource.id !== "undefined"
  )
}
