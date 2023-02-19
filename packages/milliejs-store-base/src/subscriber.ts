import type { EventEmitter } from "node:events"
import type { Resource } from "@milliejs/core"
import type { EventMap } from "./events"

export type SubscriberActionEventKeys<R extends Resource> = keyof EventMap<R>

export type SubscriberActionInterface = EventEmitter
