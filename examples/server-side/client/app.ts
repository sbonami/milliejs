import type { Entity, Resource } from "milliejs"
import millie from "./millie"
import personResource from "./resources/person"

const logSaveEvent = (resource: Resource, entity: Entity<typeof resource>) => {
  console.log("save", resource, entity)
}

const logDeleteEvent = (
  resource: Resource,
  entity: Entity<typeof resource>,
) => {
  console.log("delete", resource, entity)
}

const logDeltaEvent = (resource: Resource, entity: Entity<typeof resource>) => {
  console.log("delta", resource, entity)
}

export default async () => {
  // Setup application callbacks to respond to synchronization events
  millie.on(personResource, "millie:save", logSaveEvent)
  millie.on(personResource, "millie:delete", logDeleteEvent)
  millie.on(personResource, "millie:delta", logDeltaEvent)
}
