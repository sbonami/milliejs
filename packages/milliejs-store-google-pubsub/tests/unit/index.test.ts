import EventEmitter from "node:events"
import { makeMockEntity } from "@milliejs/jest-utils"
import {
  ClientConfig,
  PubSub,
  Subscription,
} from "@google-cloud/pubsub"
import GooglePubSubStore from "../../src"
import { LifecycleEvents } from "@milliejs/store-base"

jest.mock("@google-cloud/pubsub")
const MockPubSub = jest.mocked(PubSub)
const MockSubscription = jest.mocked(Subscription)

describe("@millie/store-google-pubsub", () => {
  describe("new GooglePubSubStore()", () => {
    it("returns a new instance of the GooglePubSubStore", () => {
      const store = new GooglePubSubStore({}, [], () => ({
        eventName: "millie:save",
        entity: makeMockEntity(),
      }))
      expect(store).toBeInstanceOf(GooglePubSubStore)
    })

    it("initializes a GooglePubSub client with the options passed", () => {
      const client = new PubSub()
      MockPubSub.mockReturnValue(client)

      const options: ClientConfig = {}
      const store = new GooglePubSubStore(options, [], () => ({
        eventName: "millie:save",
        entity: makeMockEntity(),
      }))

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

          const store = new GooglePubSubStore({}, [subscriptionName], () => ({
            eventName: "millie:save",
            entity: makeMockEntity(),
          }))

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

          const store = new GooglePubSubStore({}, [subscriptionName], () => ({
            eventName: "millie:save",
            entity: makeMockEntity(),
          }))

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

        const store = new GooglePubSubStore({}, [subscriptionName], () => ({
          eventName: "millie:save",
          entity: makeMockEntity(),
        }))
        await store.connect()

        await store.disconnect()
        expect(subscriptionObject.close).toHaveBeenCalled()
      })
    })

    it("disconnects the client", async () => {
      const client = new PubSub()
      MockPubSub.mockReturnValue(client)

      const store = new GooglePubSubStore({}, [], () => ({
        eventName: "millie:save",
        entity: makeMockEntity(),
      }))

      await store.disconnect()
      expect(client.close).toHaveBeenCalled()
    })

    it("resolves immediately", () => {
      const store = new GooglePubSubStore({}, [], () => ({
        eventName: "millie:save",
        entity: makeMockEntity(),
      }))

      return expect(store.disconnect()).resolves.toBeUndefined()
    })
  })

  describe("[message event]", () => {
    describe("when the PubSub Subscription receives a message", () => {
      it("parses the message using the constructor's parser", async () => {
        const client = new PubSub()
        MockPubSub.mockReturnValue(client)
        const subscriptionName = "test-subscription"
        const subscriptionObject = new Subscription(client, subscriptionName)
        subscriptionObject.name = `projects/test-project-id/subscriptions/${subscriptionName}`
        MockSubscription.mockReturnValueOnce(subscriptionObject)
        jest
          .spyOn<PubSub, any>(client, "getSubscriptions")
          .mockResolvedValue([[subscriptionObject]])
        const emitter = new EventEmitter()
        jest
          .spyOn<PubSub, any>(client, "subscription")
          .mockImplementation(() => emitter)

        const parser = jest
          .fn()
          .mockReturnValue({ eventName: "mockEvent", entity: {} })
        const store = new GooglePubSubStore({}, [subscriptionName], parser)
        await store.connect()

        const message = {
          ack: jest.fn(),
        }
        emitter.emit("message", message)

        await new Promise(process.nextTick)
        expect(parser).toHaveBeenCalledWith(message)
      })

      describe("when the parsing is successful", () => {
        it("acknowledges the message", async () => {
          const subscriptionName = "test-subscription"
          const emitter = new EventEmitter() as Subscription

          const mockEntity = makeMockEntity()
          const parser = jest.fn().mockReturnValue({
            eventName: LifecycleEvents.Save,
            entity: mockEntity,
          })
          const store = new GooglePubSubStore({}, [subscriptionName], parser)
          store["registerSubscription"](emitter)

          const ack = jest.fn()
          const message = { ack }
          emitter.emit("message", message)

          await new Promise(process.nextTick)
          expect(ack).toHaveBeenCalled()
        })

        it("emits an event with the name from the parsed message", (done) => {
          const subscriptionName = "test-subscription"
          const emitter = new EventEmitter() as Subscription

          const mockEntity = makeMockEntity()
          const parser = jest.fn().mockReturnValue({
            eventName: LifecycleEvents.Save,
            entity: mockEntity,
          })
          const store = new GooglePubSubStore({}, [subscriptionName], parser)
          store["registerSubscription"](emitter)

          store.once(LifecycleEvents.Save, (entity) => {
            try {
              expect(entity).toBe(mockEntity)
              done()
            } catch (error) {
              done(error)
            }
          })

          const ack = jest.fn()
          const message = { ack }
          emitter.emit("message", message)
        })
      })

      describe("when the processing fails", () => {
        it("does not acknowledge the message", async () => {
          const subscriptionName = "test-subscription"
          const emitter = new EventEmitter() as Subscription

          const mockError = new Error("Mock Error")
          const parser = jest.fn().mockImplementation(() => {
            throw mockError
          })
          const store = new GooglePubSubStore({}, [subscriptionName], parser)
          store["registerSubscription"](emitter)

          store.once("error", jest.fn())

          const ack = jest.fn()
          const message = { ack }
          emitter.emit("message", message)

          await new Promise(process.nextTick)
          expect(ack).not.toHaveBeenCalled()
        })

        it("re-emits the error from the store", (done) => {
          const subscriptionName = "test-subscription"
          const emitter = new EventEmitter() as Subscription

          const mockError = new Error("Mock Error")
          const parser = jest.fn().mockImplementation(() => {
            throw mockError
          })
          const store = new GooglePubSubStore({}, [subscriptionName], parser)
          store["registerSubscription"](emitter)

          store.once("error", (parsingError) => {
            try {
              expect(parsingError).toBe(mockError)
              done()
            } catch (error) {
              done(error)
            }
          })

          const ack = jest.fn()
          const message = { ack }
          emitter.emit("message", message)
        })
      })
    })
  })

  describe("[error event]", () => {
    describe("when the PubSub Subscription emits an error", () => {
      it("re-emits the error from the store", (done) => {
        const subscriptionName = "test-subscription"
        const emitter = new EventEmitter() as Subscription

        const mockError = new Error("Mock Error")
        const parser = jest.fn()
        const store = new GooglePubSubStore({}, [subscriptionName], parser)
        store["registerSubscription"](emitter)

        store.once("error", (subscriptionError) => {
          try {
            expect(subscriptionError).toBe(mockError)
            done()
          } catch (error) {
            done(error)
          }
        })

        emitter.emit("error", mockError)
      })
    })
  })
})
