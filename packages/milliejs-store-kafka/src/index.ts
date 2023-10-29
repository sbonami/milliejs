import EventEmitter from "node:events"
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  EachMessagePayload,
  Kafka,
  KafkaConfig,
} from "kafkajs"
import type {
  Entity,
  Resource,
  SubscriberActionEventKeys,
  SubscriberActionInterface,
} from "@milliejs/store-base"

type ParsedMessage<R extends Resource> = {
  eventName: SubscriberActionEventKeys<R>
  entity: Entity<R>
}

export type MessageParser<R extends Resource> = (
  message: EachMessagePayload,
) => ParsedMessage<R>

export type KafkaStoreConfig = KafkaConfig & { consumer: ConsumerConfig }

export class KafkaSubscriber<R extends Resource = Resource<unknown>>
  extends EventEmitter
  implements SubscriberActionInterface
{
  private client: Kafka
  private consumer: Consumer

  constructor(
    clientOptions: KafkaStoreConfig,
    private readonly topics: ConsumerSubscribeTopics[],
    readonly parser: MessageParser<R>,
  ) {
    const { consumer: consumerConfig, ..._config } = clientOptions
    super()
    this.client = new Kafka(_config)

    this.consumer = this.client.consumer(consumerConfig)
  }

  async connect() {
    await this.consumer.connect()
    await Promise.all(
      this.topics.map((topic) => this.consumer.subscribe(topic)),
    )
    await this.consumer.run({
      eachMessage: async (messagePayload: EachMessagePayload) => {
        const { topic, partition, message } = messagePayload
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
        console.log(`- ${prefix} ${message.key}#${message.value}`)

        this.messageListener(messagePayload)
      },
    })
  }

  async disconnect() {
    await this.consumer.disconnect()
  }

  private messageListener(message: EachMessagePayload) {
    try {
      const { eventName, entity } = this.parser(message)
      this.emit(eventName, entity)
    } catch (error) {
      this.emit("error", error)
    }
  }
}

export default KafkaSubscriber
