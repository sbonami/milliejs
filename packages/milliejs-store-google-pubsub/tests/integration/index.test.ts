import MillieJS, { Entity, LifecycleEvents } from "milliejs"
import {
  asyncCallback,
  makeMockEntity,
  makeMockResource,
} from "@milliejs/jest-utils"
import MillieMemoryStore from "@milliejs/store-memory"
import { PubSub, Subscription, Topic } from "@google-cloud/pubsub"
import GooglePubSubStore from "../../src/index"

const mockResource = makeMockResource({})
type MockResource = typeof mockResource
type MessageData = {
  eventName: (typeof LifecycleEvents)[keyof typeof LifecycleEvents]
  entity: Entity<MockResource>
}

const mockTopicName = mockResource.id
const mockTopicSubscriptionName = `${mockTopicName}-subscription`
const pubsubClient = new PubSub({})

describe("@milliejs/store-google-pubsub", () => {
  let millie: MillieJS
  let replicaStore: MillieMemoryStore<MockResource>
  let sourcePublisher: MillieMemoryStore<MockResource>
  let sourceSubscriber: GooglePubSubStore
  let pubsubTopic: Topic
  let pubsubSubscription: Subscription
  beforeAll(async () => {
    pubsubTopic = (await pubsubClient.createTopic(mockTopicName))[0]
    pubsubSubscription = (
      await pubsubTopic.createSubscription(mockTopicSubscriptionName)
    )[0]

    millie = new MillieJS()
    replicaStore = new MillieMemoryStore<MockResource>({})
    sourcePublisher = new MillieMemoryStore<MockResource>({})
    sourceSubscriber = new GooglePubSubStore<MockResource>(
      {},
      [mockTopicSubscriptionName],
      (message) => JSON.parse(message.data.toString()) as MessageData,
    )
    millie.registerResource(mockResource, replicaStore, {
      sourcePublisher,
      sourceSubscriber,
    })
    await new Promise((resolve) => {
      millie.listen(() => {
        resolve("Millie process started")
      })
    })
  })
  afterAll(async () => {
    await pubsubSubscription.delete()
    await pubsubTopic.delete()
    await millie?.close()
  })

  describe.each([[LifecycleEvents.Save], [LifecycleEvents.Delete]])(
    "when GooglePubSub recieves a message with the '%s' eventName",
    (event) => {
      it(`emits the '${event}' event`, () => {
        expect.assertions(2)

        const mockEntity = makeMockEntity({
          resource: mockResource,
        })

        return asyncCallback((done) => {
          millie.once(
            mockResource,
            event,
            (resource: MockResource, entity: Entity<MockResource>) => {
              try {
                expect(resource).toBe(mockResource)
                expect(entity).toEqual(mockEntity)
                done()
              } catch (error) {
                done(error)
              }
            },
          )

          return pubsubTopic.publishMessage({
            json: {
              eventName: event,
              entity: mockEntity,
            },
          })
        })
      })
    },
  )
})
