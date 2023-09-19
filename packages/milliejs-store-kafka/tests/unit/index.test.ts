import { Kafka, KafkaConfig } from "kafkajs"
import KafkaStore from "../../src"

jest.mock("kafkajs")
const MockKafka = jest.mocked(Kafka)

describe("@millie/store-kafka", () => {
  describe("new KafkaStore()", () => {
    it("returns a new instance of the KafkaStore", () => {
      const options: KafkaConfig = {
        brokers: ["localhost:9092"],
      }
      const store = new KafkaStore(options)
      expect(store).toBeInstanceOf(KafkaStore)
    })

    it("initializes a Kafka client with the options passed", () => {
      const client = new Kafka({
        brokers: ["localhost:9092"],
      })
      MockKafka.mockReturnValue(client)

      const options: KafkaConfig = {
        brokers: ["localhost:9092"],
      }
      const store = new KafkaStore(options)

      expect(MockKafka).toHaveBeenCalledWith(options)
      expect(store["client"]).toBe(client)
    })
  })
})
