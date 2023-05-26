import type { Entity, Query, Resource } from "@milliejs/core"
import { makeMockEntity } from "@milliejs/jest-utils"
import {
  PublisherActionInterface,
  isPublisherActionInterface,
} from "../../src/publisher"

type MockResource = Resource
const mockEntity = makeMockEntity<MockResource>()

const conformingObject: PublisherActionInterface<MockResource> = {
  create() {
    return Promise.resolve(mockEntity)
  },
  read() {
    return Promise.resolve([])
  },
  update() {
    return Promise.resolve([])
  },
  patch() {
    return Promise.resolve([])
  },
  delete() {
    return Promise.resolve([])
  },
}

describe("publisher", () => {
  describe("isPublisherActionInterface", () => {
    describe("when the passed object conforms to the PublisherActionInterface", () => {
      it("should return true", () => {
        expect(isPublisherActionInterface<MockResource>(conformingObject)).toBe(
          true,
        )
      })
    })

    describe.each([["create"], ["read"], ["update"], ["patch"], ["delete"]])(
      "[%s]",
      (methodName) => {
        describe(`when the passed object does not have a ${methodName} method`, () => {
          it("should return false", () => {
            const malformedObject = {
              ...conformingObject,
              [methodName]: undefined,
            }
            expect(
              isPublisherActionInterface<MockResource>(malformedObject),
            ).toBe(false)
          })
        })
      },
    )
  })
})
