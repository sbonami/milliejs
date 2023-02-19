import EventEmitter from "node:events"
import type { Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import * as StoreBaseModule from "@milliejs/store-base"
import * as StoreEventModule from "../../../src/store/events"

type MockResource = Resource

describe("events", () => {
  describe("isEventEmitter", () => {
    const { isEventEmitter } = StoreEventModule
    const conformingObject: EventEmitter = new EventEmitter()

    describe("when the passed object conforms to the EventEmitter interface", () => {
      it("should return true", () => {
        expect(isEventEmitter(conformingObject)).toBe(true)
      })
    })

    describe.each([
      ["addListener"],
      ["removeListener"],
      ["removeAllListeners"],
      ["setMaxListeners"],
      ["getMaxListeners"],
      ["listenerCount"],
      ["listeners"],
      ["rawListeners"],
      ["prependListener"],
      ["prependOnceListener"],
      ["eventNames"],
      ["on"],
      ["once"],
      ["off"],
      ["emit"],
    ])("[%s]", (methodName) => {
      describe(`when the passed object does not have a ${methodName} method`, () => {
        it("should return false", () => {
          const malformedObject = {
            ...conformingObject,
            [methodName]: undefined,
          }
          expect(isEventEmitter(malformedObject)).toBe(false)
        })
      })
    })
  })

  describe("isPublisherActionEventInterface", () => {
    const { isPublisherActionEventInterface } = StoreEventModule
    const conformingObject: EventEmitter &
      PublisherActionInterface<MockResource> =
      new (class extends EventEmitter {})()

    describe("when the passed object conforms to the EventEmitter and PublisherActionEventInterface interfaces", () => {
      it("should return true", () => {
        expect(isPublisherActionEventInterface(conformingObject)).toBe(true)
      })
    })

    describe("when the passed object does not conform to the EventEmitter interface", () => {
      it("should return false", () => {
        const malformedObject = Object.getOwnPropertyNames(
          EventEmitter.prototype,
        ).reduce((_object, property) => {
          return { ...conformingObject, [property]: undefined }
        }, conformingObject)

        expect(isPublisherActionEventInterface(malformedObject)).toBe(false)
      })
    })

    describe("when the passed object does not conform to the PublisherActionEventInterface interface", () => {
      beforeEach(() => {
        jest
          .spyOn(StoreBaseModule, "isPublisherActionInterface")
          .mockReturnValue(false)
      })

      it("should return false", () => {
        expect(isPublisherActionEventInterface(conformingObject)).toBe(false)
      })
    })
  })

  describe("PublisherActionEventWrapper", () => {})
})
