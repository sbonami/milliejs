import type { Entity, Resource, LifecycleEventsType } from "@milliejs/core"

export type EventMap<R extends Resource> = Record<
  LifecycleEventsType,
  (entity: Entity<R>) => void
>
