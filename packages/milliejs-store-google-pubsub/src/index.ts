import EventEmitter from "node:events"
import type { SubscriberActionInterface } from "@milliejs/store-base"

export class GooglePubSubSubscriber
  extends EventEmitter
  implements SubscriberActionInterface {}

export default GooglePubSubSubscriber
