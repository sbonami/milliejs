import EventEmitter from "node:events"
import {
  ClientConfig,
  Message,
  PubSub,
  Subscription,
} from "@google-cloud/pubsub"
import type {
  Entity,
  Resource,
  SubscriberActionEventKeys,
  SubscriberActionInterface,
} from "@milliejs/store-base"
import invariant from "tiny-invariant"

type ParsedMessage<R extends Resource> = {
  eventName: SubscriberActionEventKeys<R>
  entity: Entity<R>
}

type MessageParser<R extends Resource> = (message: Message) => ParsedMessage<R>

export class GooglePubSubSubscriber<R extends Resource = Resource<unknown>>
  extends EventEmitter
  implements SubscriberActionInterface
{
  private client: PubSub
  private subscriptions: Subscription[] = []

  constructor(
    clientOptions: ClientConfig,
    readonly subscriptionNames: string[],
    readonly parser: MessageParser<R>,
  ) {
    super()
    this.client = new PubSub(clientOptions)
  }

  async connect() {
    const [registeredSubscriptions] = await this.client.getSubscriptions()
    const registeredSubscriptionNames = registeredSubscriptions.reduce<
      Record<string, string>
    >(
      (_names, subscription) => ({
        ..._names,
        [subscription.name.split("/")[3]]: subscription.name,
      }),
      {},
    )

    await Promise.all(
      this.subscriptionNames.map(async (subscriptionName) => {
        const fullyQualifiedSubscription =
          registeredSubscriptionNames[subscriptionName]
        invariant(fullyQualifiedSubscription, "Subscription does not exist")

        const subscription = await this.client.subscription(
          fullyQualifiedSubscription,
        )
        this.registerSubscription(subscription)
      }),
    )
  }

  async disconnect() {
    await Promise.all(
      this.subscriptions.map(async (subscription) => {
        subscription.removeListener("message", this.messageListener)
        await subscription.close()
      }),
    )

    await this.client.close()
  }

  private registerSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription)

    subscription.on("message", this.messageListener.bind(this))

    subscription.on("error", (error: Error) => {
      this.emit("error", error)
    })
  }

  private messageListener(message: Message) {
    try {
      const { eventName, entity } = this.parser(message)
      this.emit(eventName, entity)

      message.ack()
    } catch (error) {
      this.emit("error", error)
    }
  }
}

export default GooglePubSubSubscriber
