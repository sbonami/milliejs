import EventEmitter from "node:events"
import { ClientConfig, PubSub } from "@google-cloud/pubsub"
import type { SubscriberActionInterface } from "@milliejs/store-base"

export class GooglePubSubSubscriber
  extends EventEmitter
  implements SubscriberActionInterface
{
  private client: PubSub

  constructor(clientOptions: ClientConfig) {
    super()
    this.client = new PubSub(clientOptions)
  }

  async connect() {}

  async disconnect() {
    await this.client.close()
  }
}

export default GooglePubSubSubscriber
