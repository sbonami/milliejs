import { EventEmitter } from "node:events"
import type { Resource } from "@milliejs/core"
import {
  PublisherActionInterface,
  SubscriberActionInterface,
  isPublisherActionInterface,
} from "@milliejs/store-base"

export interface PublisherActionEventInterface<R extends Resource>
  extends PublisherActionInterface<R>,
    SubscriberActionInterface {}

export function isEventEmitter(
  emitterOrAny: EventEmitter | unknown,
): emitterOrAny is EventEmitter {
  return !!(
    typeof (emitterOrAny as EventEmitter).addListener !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).removeListener !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).removeAllListeners !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).setMaxListeners !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).getMaxListeners !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).listenerCount !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).listeners !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).rawListeners !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).prependListener !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).prependOnceListener !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).eventNames !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).on !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).once !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).off !== "undefined" &&
    typeof (emitterOrAny as EventEmitter).emit !== "undefined"
  )
}

export function isPublisherActionEventInterface<R extends Resource>(
  interfaceOrAny: PublisherActionEventInterface<R> | unknown,
): interfaceOrAny is PublisherActionEventInterface<R> {
  return (
    isEventEmitter(interfaceOrAny) && isPublisherActionInterface(interfaceOrAny)
  )
}

export class PublisherActionEventWrapper<R extends Resource>
  extends EventEmitter
  implements PublisherActionEventInterface<R>, SubscriberActionInterface
{
  constructor(private readonly store: PublisherActionInterface<R>) {
    super()
  }
}

export default PublisherActionEventWrapper
