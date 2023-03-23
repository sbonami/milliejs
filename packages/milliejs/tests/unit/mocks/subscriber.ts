import { EventEmitter } from "node:events"
import type { SubscriberActionInterface } from "@milliejs/store-base"

export const makeMockSubscriber = (): SubscriberActionInterface => {
  return new (class
    extends EventEmitter
    implements SubscriberActionInterface {})()
}
