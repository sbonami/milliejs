import { ClientConfig, PubSub, Subscription } from "@google-cloud/pubsub"
import GooglePubSubStore from "../../src"

jest.mock("@google-cloud/pubsub")
const MockPubSub = jest.mocked(PubSub)
const MockSubscription = jest.mocked(Subscription)

describe("@millie/store-google-pubsub", () => {
  describe("new GooglePubSubStore()", () => {
    it("returns a new instance of the GooglePubSubStore", () => {
      const store = new GooglePubSubStore({}, [])
      expect(store).toBeInstanceOf(GooglePubSubStore)
    })

    it("initializes a GooglePubSub client with the options passed", () => {
      const client = new PubSub()
      MockPubSub.mockReturnValue(client)

      const options: ClientConfig = {}
      const store = new GooglePubSubStore(options, [])

      expect(MockPubSub).toHaveBeenCalledWith(options)
      expect(store["client"]).toBe(client)
    })
  })

  describe("#connect()", () => {
    describe("when subscription names were passed to the constructor", () => {
      describe("when a matching subscription exists on the topic", () => {
        it("saves a reference to the PubSub Subscription", async () => {
          const client = new PubSub()
          MockPubSub.mockReturnValue(client)

          const subscriptionName = "test-subscription"
          const subscriptionObject = new Subscription(client, subscriptionName)
          subscriptionObject.name = `projects/test-project-id/subscriptions/${subscriptionName}`
          MockSubscription.mockReturnValueOnce(subscriptionObject)

          jest
            .spyOn<PubSub, any>(client, "getSubscriptions")
            .mockResolvedValue([[subscriptionObject]])
          jest
            .spyOn<PubSub, any>(client, "subscription")
            .mockImplementation(() => subscriptionObject)

          const store = new GooglePubSubStore({}, [subscriptionName])

          await store.connect()
          expect(store["subscriptions"]).toEqual(
            expect.arrayContaining([subscriptionObject]),
          )
        })
      })

      describe("when the subscription does not exist on the topic", () => {
        it("throws an error", () => {
          const client = new PubSub()
          MockPubSub.mockReturnValue(client)

          const subscriptionName = "test-subscription"

          jest
            .spyOn<PubSub, any>(client, "getSubscriptions")
            .mockResolvedValue([[]])
          jest
            .spyOn<PubSub, any>(client, "subscription")
            .mockImplementation(() => undefined)

          const store = new GooglePubSubStore({}, [subscriptionName])

          expect(store.connect()).rejects.toThrowErrorMatchingSnapshot()
        })
      })
    })
  })

  describe("#disconnect()", () => {
    describe("when subscription names were passed to the constructor", () => {
      it("closes each subscription", async () => {
        const client = new PubSub()
        MockPubSub.mockReturnValue(client)

        const subscriptionName = "test-subscription"
        const subscriptionObject = new Subscription(client, subscriptionName)
        subscriptionObject.name = `projects/test-project-id/subscriptions/${subscriptionName}`
        MockSubscription.mockReturnValueOnce(subscriptionObject)

        jest
          .spyOn<PubSub, any>(client, "getSubscriptions")
          .mockResolvedValue([[subscriptionObject]])
        jest
          .spyOn<PubSub, any>(client, "subscription")
          .mockImplementation(() => subscriptionObject)

        const store = new GooglePubSubStore({}, [subscriptionName])
        await store.connect()

        await store.disconnect()
        expect(subscriptionObject.close).toHaveBeenCalled()
      })
    })

    it("disconnects the client", async () => {
      const client = new PubSub()
      MockPubSub.mockReturnValue(client)

      const store = new GooglePubSubStore({}, [])

      await store.disconnect()
      expect(client.close).toHaveBeenCalled()
    })

    it("resolves immediately", () => {
      const store = new GooglePubSubStore({}, [])

      return expect(store.disconnect()).resolves.toBeUndefined()
    })
  })
})
