import MillieJS, { Entity, LifecycleEvents } from "milliejs"
import {
  asyncCallback,
  makeMockEntity,
  makeMockResource,
} from "@milliejs/jest-utils"
import MillieMemoryStore from "@milliejs/store-memory"
import { CompressionTypes, Kafka, Partitioners } from "kafkajs"
import invariant from "tiny-invariant"
import KafkaStore from "../../src/index"

const mockResource = makeMockResource({})
type MockResource = typeof mockResource
type MessageData = {
  eventName: (typeof LifecycleEvents)[keyof typeof LifecycleEvents]
  entity: Entity<MockResource>
}

const mockTopicName = mockResource.id

const kafkaClient = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "kafka-integration-test-producer",
})
const kafkaAdmin = kafkaClient.admin()
const kafkaProducer = kafkaClient.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
})

describe("@milliejs/store-kafka", () => {
  let millie: MillieJS
  let replicaStore: MillieMemoryStore<MockResource>
  let sourcePublisher: MillieMemoryStore<MockResource>
  let sourceSubscriber: KafkaStore
  beforeAll(async () => {
    await kafkaAdmin.connect()
    await kafkaAdmin.createTopics({
      topics: [
        {
          topic: mockTopicName,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    })
    await kafkaAdmin.disconnect()

    await kafkaProducer.connect()

    millie = new MillieJS()
    replicaStore = new MillieMemoryStore<MockResource>({})
    sourcePublisher = new MillieMemoryStore<MockResource>({})
    sourceSubscriber = new KafkaStore<MockResource>(
      {
        brokers: ["localhost:9092"],
        consumer: {
          groupId: "kafka-integration-test-consumer",
        },
      },
      [
        {
          topics: [mockTopicName],
        },
      ],
      ({ message }) => {
        invariant(message.value)

        return JSON.parse(message.value.toString()) as MessageData
      },
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
    await kafkaProducer.disconnect()
    await millie?.close()
  })

  describe.each([[LifecycleEvents.Save], [LifecycleEvents.Delete]])(
    "when Kafka publishes a message with the '%s' eventName",
    (event) => {
      it(`emits the '${event}' event`, () => {
        expect.assertions(2)

        const mockEntity = makeMockEntity({
          resource: mockResource,
        })
        const message: MessageData = {
          eventName: event,
          entity: mockEntity,
        }

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

          return kafkaProducer.send({
            topic: mockTopicName,
            compression: CompressionTypes.GZIP,
            messages: [
              {
                key: mockEntity.id,
                value: JSON.stringify(message),
              },
            ],
          })
        })
      })
    },
  )
})
