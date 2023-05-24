import { ClientConfig, PubSub } from "@google-cloud/pubsub"
import GooglePubSubStore from "../../src"

jest.mock("@google-cloud/pubsub")
const MockPubSub = jest.mocked(PubSub)

describe("@millie/store-google-pubsub", () => {
  describe("new GooglePubSubStore()", () => {
    it("returns a new instance of the GooglePubSubStore", () => {
      const store = new GooglePubSubStore({})
      expect(store).toBeInstanceOf(GooglePubSubStore)
    })

    it("initializes a GooglePubSub client with the options passed", () => {
      const client = new PubSub()
      MockPubSub.mockReturnValue(client)

      const options: ClientConfig = {}
      const store = new GooglePubSubStore(options)

      expect(MockPubSub).toHaveBeenCalledWith(options)
      expect(store["client"]).toBe(client)
    })
  })

  describe("#connect()", () => {
    it("resolves immediately", () => {
      const store = new GooglePubSubStore({})

      return expect(store.connect()).resolves.toBeUndefined()
    })
  })

  describe("#disconnect()", () => {
    it("disconnects the client", async () => {
      const client = new PubSub()
      MockPubSub.mockReturnValue(client)

      const store = new GooglePubSubStore({})

      await store.disconnect()
      expect(client.close).toHaveBeenCalled()
    })

    it("resolves immediately", () => {
      const store = new GooglePubSubStore({})

      return expect(store.disconnect()).resolves.toBeUndefined()
    })
  })
})
