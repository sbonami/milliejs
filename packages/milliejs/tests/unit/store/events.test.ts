import EventEmitter from "node:events"
import type { Entity, Query, Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import * as StoreBaseModule from "@milliejs/store-base"
import * as StoreEventModule from "../../../src/store/events"
import { makeMockPublisher } from "../mocks/publisher"

type MockResource = Resource
const mockResource: Resource = {
  id: "mock",
}
const mockEntity: Entity<MockResource> = {
  id: "a",
  resource: mockResource,
  data: {},
}
const mockQuery: Query = {
  resource: mockResource,
  cardinality: "many",
  attributes: {},
}

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
      PublisherActionInterface<MockResource> = new (class extends EventEmitter {
      create(entity: Entity<MockResource>) {
        return Promise.resolve(mockEntity)
      }
      read(query: Query) {
        return Promise.resolve([])
      }
      update(
        entityOrQuery: Entity<MockResource> | Query,
        data: Entity<MockResource>["data"],
      ) {
        return Promise.resolve([])
      }
      patch(entityOrQuery: Entity<MockResource> | Query, patch: any) {
        return Promise.resolve([])
      }
      delete(entityOrQuery: Entity<MockResource> | Query) {
        return Promise.resolve([])
      }
    })()

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

  describe("PublisherActionEventWrapper", () => {
    const { PublisherActionEventWrapper } = StoreEventModule
    const mockUneventfulStore = makeMockPublisher()
    let mockWrapper: StoreEventModule.PublisherActionEventInterface<MockResource> &
      StoreBaseModule.SubscriberActionInterface
    beforeEach(() => {
      mockWrapper = new PublisherActionEventWrapper<MockResource>(
        mockUneventfulStore,
      )
    })

    describe("create", () => {
      it('throws a "Not Implemented" Error', () => {
        expect(() => {
          mockWrapper.create(mockEntity)
        }).toThrow("Not Implemented")
      })
    })

    describe("read", () => {
      it('throws a "Not Implemented" Error', () => {
        expect(() => {
          mockWrapper.read(mockQuery)
        }).toThrow("Not Implemented")
      })
    })

    describe("update", () => {
      it('throws a "Not Implemented" Error', () => {
        expect(() => {
          mockWrapper.update(mockQuery, {})
        }).toThrow("Not Implemented")
      })
    })

    describe("patch", () => {
      it('throws a "Not Implemented" Error', () => {
        expect(() => {
          mockWrapper.patch(mockQuery, {})
        }).toThrow("Not Implemented")
      })
    })

    describe("delete", () => {
      it('throws a "Not Implemented" Error', () => {
        expect(() => {
          mockWrapper.delete(mockQuery)
        }).toThrow("Not Implemented")
      })
    })
  })
})
