import type { Resource } from "@milliejs/core"

export interface EventMap<R extends Resource> {}
export type EventKey<R extends Resource, T extends EventMap<R>> = string &
  keyof T
export type EventParameters<
  R extends Resource,
  K extends keyof EventMap<R>,
> = Parameters<EventMap<R>[K]>
