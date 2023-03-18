import { Query, isQuery } from "../../src/query"
import type { Resource } from "../../src/resource"

type MockResource = Resource
const mockResource: MockResource = {
  id: "mockResource",
}
type MockQuery = Query

const conformingObject: MockQuery = {
  resource: mockResource,
  cardinality: "one",
  attributes: {},
}

describe("query", () => {
  describe("isQuery", () => {
    describe("when the passed object conforms to the Query shape", () => {
      it("should return true", () => {
        expect(isQuery(conformingObject)).toBe(true)
      })
    })

    describe.each([["resource"], ["cardinality"], ["attributes"]])(
      "[%s]",
      (propertyName) => {
        describe(`when the passed object does not have a ${propertyName} property`, () => {
          it("should return false", () => {
            const malformedObject = {
              ...conformingObject,
              [propertyName]: undefined,
            }
            expect(isQuery(malformedObject)).toBe(false)
          })
        })
      },
    )
  })
})
