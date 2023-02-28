import { Entity, isEntity } from "../../src/entity"
import type { Resource } from "../../src/resource"

type MockResource = Resource
type MockEntity = Entity<MockResource>

const conformingObject: MockEntity = {
  id: "abc123",
  resource: {
    id: "mockResource",
  },
  data: {},
}

describe("entity", () => {
  describe("isEntity", () => {
    describe("when the passed object conforms to the Entity shape", () => {
      it("should return true", () => {
        expect(isEntity<MockResource>(conformingObject)).toBe(true)
      })
    })

    describe.each<[string, (e: MockEntity) => any]>([
      ["id", (e: MockEntity) => ({ ...e, ["id"]: undefined })],
      ["resource", (e: MockEntity) => ({ ...e, ["resource"]: undefined })],
      [
        "resource id",
        (e: MockEntity) => ({
          ...e,
          ["resource"]: { ...e.resource, ["id"]: undefined },
        }),
      ],
    ])("[%s]", (methodName, entityFactory) => {
      describe(`when the passed object does not have a ${methodName}`, () => {
        it("should return false", () => {
          const malformedObject = entityFactory(conformingObject)

          expect(isEntity<MockResource>(malformedObject)).toBe(false)
        })
      })
    })
  })
})
