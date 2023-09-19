import EventEmitter from "node:events"
import {
  Kafka,
  KafkaConfig
} from "kafkajs"
import type {
  Resource,
  SubscriberActionInterface,
} from "@milliejs/store-base"
export class KafkaSubscriber<R extends Resource = Resource<unknown>>
  extends EventEmitter
  implements SubscriberActionInterface
{
  private client: Kafka

  constructor(
    clientOptions: KafkaConfig
  ) {
    super()
    this.client = new Kafka(clientOptions)
  }
}

export default KafkaSubscriber
