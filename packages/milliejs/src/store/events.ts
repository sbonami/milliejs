import { EventEmitter } from "node:events"
import type { Entity, Query, Resource } from "@milliejs/core"
import {
  LifecycleEvents,
  PublisherActionInterface,
  SubscriberActionInterface,
  isPublisherActionInterface,
} from "@milliejs/store-base"

export interface PublisherActionEventInterface<R extends Resource>
  extends PublisherActionInterface<R>,
    SubscriberActionInterface {}

export function isEventEmitter(
  emitterOrUnknown: EventEmitter | unknown,
): emitterOrUnknown is EventEmitter {
  return !!(
    typeof (emitterOrUnknown as EventEmitter).addListener !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).removeListener !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).removeAllListeners !==
      "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).setMaxListeners !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).getMaxListeners !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).listenerCount !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).listeners !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).rawListeners !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).prependListener !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).prependOnceListener !==
      "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).eventNames !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).on !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).once !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).off !== "undefined" &&
    typeof (emitterOrUnknown as EventEmitter).emit !== "undefined"
  )
}

export function isPublisherActionEventInterface<R extends Resource>(
  interfaceOrUnknown: PublisherActionEventInterface<R> | unknown,
): interfaceOrUnknown is PublisherActionEventInterface<R> {
  return (
    isEventEmitter(interfaceOrUnknown) &&
    isPublisherActionInterface(interfaceOrUnknown)
  )
}

export class PublisherActionEventWrapper<R extends Resource>
  extends EventEmitter
  implements PublisherActionEventInterface<R>, SubscriberActionInterface
{
  constructor(private readonly store: PublisherActionInterface<R>) {
    super()
  }

  async create(entity: Entity<R>) {
    const newEntity = await this.store.create(entity)

    this.emit(LifecycleEvents.Save, newEntity)

    return newEntity
  }

  async read(query: Query) {
    return this.store.read(query)
  }

  async update(entityOrQuery: Query | Entity<R>, data: Entity<R>["data"]) {
    const entities = await this.store.update(entityOrQuery, data)

    entities.forEach((entity) => {
      this.emit(LifecycleEvents.Save, entity)
    })

    return entities
  }

  async patch(entityOrQuery: Query | Entity<R>, patch: any) {
    const entities = await this.store.patch(entityOrQuery, patch)

    entities.forEach((entity) => {
      this.emit(LifecycleEvents.Save, entity)
    })

    return entities
  }

  async delete(entityOrQuery: Query | Entity<R>) {
    const entities = await this.store.delete(entityOrQuery)

    if (typeof entities !== "boolean") {
      entities.forEach((entity) => {
        this.emit(LifecycleEvents.Delete, entity)
      })
    }

    return entities
  }
}

export default PublisherActionEventWrapper
