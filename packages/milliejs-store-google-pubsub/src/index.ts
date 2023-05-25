import EventEmitter from "node:events"
import { ClientConfig, PubSub, Subscription } from "@google-cloud/pubsub"
import type { SubscriberActionInterface } from "@milliejs/store-base"
import invariant from "tiny-invariant"

export class GooglePubSubSubscriber
  extends EventEmitter
  implements SubscriberActionInterface
{
  private client: PubSub
  private subscriptions: Subscription[] = []

  constructor(
    clientOptions: ClientConfig,
    readonly subscriptionNames: string[],
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
        this.subscriptions.push(subscription)
      }),
    )
  }

  async disconnect() {
    await Promise.all(
      this.subscriptions.map(async (subscription) => {
        await subscription.close()
      }),
    )

    await this.client.close()
  }
}

export default GooglePubSubSubscriber
