import type { Entity, Query, Resource } from "@milliejs/core"
import {
  PublisherActionInterface,
  isPublisherActionInterface,
} from "../../src/publisher"

type MockResource = Resource
const mockResource: Resource = {
  id: "mock",
}
const mockEntity: Entity<MockResource> = {
  id: "a",
  resource: mockResource,
  data: {},
}
const conformingObject: PublisherActionInterface<MockResource> = {
  create(entity: Entity<MockResource>) {
    return Promise.resolve(mockEntity)
  },
  read(query: Query) {
    return Promise.resolve([])
  },
  update(
    entityOrQuery: Entity<MockResource> | Query,
    data: Entity<MockResource>["data"],
  ) {
    return Promise.resolve([])
  },
  patch(entityOrQuery: Entity<MockResource> | Query, patch: any) {
    return Promise.resolve([])
  },
  delete(entityOrQuery: Entity<MockResource> | Query) {
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
