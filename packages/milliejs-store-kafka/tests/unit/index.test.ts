import { makeMockEntity } from "@milliejs/jest-utils"
import {
  Consumer,
  EachMessageHandler,
  EachMessagePayload,
  Kafka,
  KafkaConfig,
} from "kafkajs"
import KafkaStore, { KafkaStoreConfig } from "../../src"
import { LifecycleEvents } from "@milliejs/store-base"

jest.mock("kafkajs")
const MockKafka = jest.mocked(Kafka)
const mockConsumer: Consumer = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  subscribe: jest.fn(),
  stop: jest.fn(),
  seek: jest.fn(),
  run: jest.fn(),
  commitOffsets: jest.fn(),
  describeGroup: jest.fn(),
  pause: jest.fn(),
  paused: jest.fn(),
  resume: jest.fn(),
  on: jest.fn(),
  logger: jest.fn(),
  events: jest.fn(),
} as unknown as jest.MockedObject<Consumer>

describe("@millie/store-kafka", () => {
  describe("new KafkaStore()", () => {
    const clientOptions: KafkaConfig = {
      brokers: ["localhost:9092"],
    }
    const consumerOptions: KafkaStoreConfig["consumer"] = {
      groupId: "testGroupId",
    }
    const topics = [{ topics: ["test-topic"] }]
    const parser = jest.fn()

    it("returns a new instance of the KafkaStore", () => {
      const store = new KafkaStore(
        { ...clientOptions, consumer: consumerOptions },
        topics,
        parser,
      )
      expect(store).toBeInstanceOf(KafkaStore)
    })

    it("initializes a Kafka client with the options passed", () => {
      const client = new Kafka({
        brokers: ["localhost:9092"],
      })
      MockKafka.mockReturnValue(client)
      const consumerClient = jest.fn()
      jest
        .spyOn(Kafka.prototype, "consumer")
        .mockReturnValue(consumerClient as unknown as Consumer)

      const store = new KafkaStore(
        { ...clientOptions, consumer: consumerOptions },
        topics,
        parser,
      )
      expect(MockKafka).toHaveBeenCalledWith(clientOptions)
      expect(store["client"]).toBe(client)
      expect(store["topics"]).toBe(topics)
      expect(store["parser"]).toBe(parser)
    })

    it("initializes a Kafka consumer with the provided consumer options", () => {
      const client = new Kafka({
        brokers: ["localhost:9092"],
      })
      MockKafka.mockReturnValue(client)
      const consumerClient = jest.fn()
      jest
        .spyOn(Kafka.prototype, "consumer")
        .mockReturnValue(consumerClient as unknown as Consumer)

      const store = new KafkaStore(
        { ...clientOptions, consumer: consumerOptions },
        topics,
        parser,
      )
      expect(client.consumer).toHaveBeenCalledWith(consumerOptions)
      expect(store["consumer"]).toBe(consumerClient)
    })
  })

  describe("#connect()", () => {
    it("connects the consumer", async () => {
      const options: KafkaStoreConfig = {
        brokers: ["localhost:9092"],
        consumer: {
          groupId: "testGroupId",
        },
      }
      const topics = [{ topics: ["test-topic"] }]
      const parser = jest.fn()

      const client = new Kafka({
        brokers: ["localhost:9092"],
      })
      MockKafka.mockReturnValue(client)
      jest.spyOn(MockKafka.prototype, "consumer").mockReturnValue(mockConsumer)

      const store = new KafkaStore(options, topics, parser)

      await store.connect()
      expect(mockConsumer.connect).toHaveBeenCalled()
    })

    it("subscribes each of the topics with the consumer", async () => {
      const options: KafkaStoreConfig = {
        brokers: ["localhost:9092"],
        consumer: {
          groupId: "testGroupId",
        },
      }
      const topics = [{ topics: ["test-topic"] }]
      const parser = jest.fn()

      const client = new Kafka({
        brokers: ["localhost:9092"],
      })
      MockKafka.mockReturnValue(client)
      jest.spyOn(MockKafka.prototype, "consumer").mockReturnValue(mockConsumer)

      const store = new KafkaStore(options, topics, parser)

      await store.connect()
      expect(mockConsumer.subscribe).toHaveBeenCalledWith(topics[0])
    })

    it("registers a message processor with the consumer", async () => {
      const options: KafkaStoreConfig = {
        brokers: ["localhost:9092"],
        consumer: {
          groupId: "testGroupId",
        },
      }
      const topics = [{ topics: ["test-topic"] }]
      const parser = jest.fn()

      const client = new Kafka({
        brokers: ["localhost:9092"],
      })
      MockKafka.mockReturnValue(client)
      jest.spyOn(MockKafka.prototype, "consumer").mockReturnValue(mockConsumer)

      const store = new KafkaStore(options, topics, parser)

      await store.connect()
      expect(mockConsumer.run).toHaveBeenCalledWith(
        expect.objectContaining({
          eachMessage: expect.any(Function),
        }),
      )
    })
  })

  describe("#disconnect()", () => {
    it("disconnect the consumer", async () => {
      const options: KafkaStoreConfig = {
        brokers: ["localhost:9092"],
        consumer: {
          groupId: "testGroupId",
        },
      }
      const topics = [{ topics: ["test-topic"] }]
      const parser = jest.fn()

      const client = new Kafka({
        brokers: ["localhost:9092"],
      })
      MockKafka.mockReturnValue(client)
      jest.spyOn(MockKafka.prototype, "consumer").mockReturnValue(mockConsumer)

      const store = new KafkaStore(options, topics, parser)

      await store.disconnect()
      expect(mockConsumer.disconnect).toHaveBeenCalled()
    })
  })

  describe("[message event]", () => {
    const options: KafkaStoreConfig = {
      brokers: ["localhost:9092"],
      consumer: {
        groupId: "testGroupId",
      },
    }
    const topics = [{ topics: ["test-topic"] }]
    let store: KafkaStore
    let eachMessageCallback: EachMessageHandler
    const parser = jest.fn()

    beforeEach(async () => {
      const client = new Kafka({
        brokers: ["localhost:9092"],
      })
      MockKafka.mockReturnValue(client)
      jest.spyOn(MockKafka.prototype, "consumer").mockReturnValue(mockConsumer)
      jest.spyOn(mockConsumer, "run").mockImplementation((config) => {
        eachMessageCallback = config!.eachMessage!
        return Promise.resolve()
      })

      store = new KafkaStore(options, topics, parser)
      await store.connect()
    })

    describe("when the Kafka store receives a message", () => {
      it("parses the message using the constructor's parser", async () => {
        const mockEntity = makeMockEntity()
        parser.mockReturnValue({
          eventName: LifecycleEvents.Save,
          entity: mockEntity,
        })

        const message: EachMessagePayload = {
          topic: "test-topic",
          partition: 0,
          message: {
            key: null,
            value: null,
            timestamp: Date.now().toString(),
            attributes: 0,
            offset: "",
            size: 0,
          },
          heartbeat: jest.fn(),
          pause: jest.fn(),
        }

        eachMessageCallback(message)
        expect(parser).toHaveBeenCalledWith(message)
      })

      describe("when the parsing is successful", () => {
        it("emits an event with the name from the parsed message", (done) => {
          const mockEntity = makeMockEntity()
          parser.mockReturnValue({
            eventName: LifecycleEvents.Save,
            entity: mockEntity,
          })

          store.once(LifecycleEvents.Save, (entity) => {
            try {
              expect(entity).toBe(mockEntity)
              done()
            } catch (error) {
              done(error)
            }
          })

          const message: EachMessagePayload = {
            topic: "test-topic",
            partition: 0,
            message: {
              key: null,
              value: null,
              timestamp: Date.now().toString(),
              attributes: 0,
              offset: "",
              size: 0,
            },
            heartbeat: jest.fn(),
            pause: jest.fn(),
          }
          eachMessageCallback(message)
        })
      })

      describe("when the processing fails", () => {
        it("re-emits the error from the store", (done) => {
          const mockError = new Error("Mock Error")
          parser.mockImplementation(() => {
            throw mockError
          })

          store.once("error", (parsingError) => {
            try {
              expect(parsingError).toBe(mockError)
              done()
            } catch (error) {
              done(error)
            }
          })

          const message: EachMessagePayload = {
            topic: "test-topic",
            partition: 0,
            message: {
              key: null,
              value: null,
              timestamp: Date.now().toString(),
              attributes: 0,
              offset: "",
              size: 0,
            },
            heartbeat: jest.fn(),
            pause: jest.fn(),
          }
          eachMessageCallback(message)
        })
      })
    })
  })
})
