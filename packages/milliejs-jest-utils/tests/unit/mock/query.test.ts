import { makeMockQuery } from "../../../src/mocks/query"
import * as MockResourceModule from "../../../src/mocks/resource"

const { makeMockResource } = MockResourceModule

describe("mocks/query.ts", () => {
  describe("makeMockQuery", () => {
    describe("[resource]", () => {
      describe("when an override is provided", () => {
        it("accepts the resource override", () => {
          const resource = makeMockResource()

          expect(makeMockQuery({ resource })).toHaveProperty(
            "resource",
            resource,
          )
        })
      })

      describe("when an override is not provided", () => {
        it("creates a new resource with each invocation", () => {
          expect(makeMockQuery().resource).not.toBe(makeMockQuery().resource)
        })

        it("uses the makeMockResource factory to create a valid mock resource", () => {
          const mockResource = makeMockResource()
          jest
            .spyOn(MockResourceModule, "makeMockResource")
            .mockReturnValue(mockResource)

          expect(makeMockQuery()).toHaveProperty("resource", mockResource)
        })
      })
    })

    describe("[cardinality]", () => {
      describe("when an override is provided", () => {
        it("accepts the data override", () => {
          const cardinality = "one"

          expect(makeMockQuery({ cardinality })).toHaveProperty(
            "cardinality",
            cardinality,
          )
        })
      })

      describe("when an override is not provided", () => {
        it.skip("creates new data with each invocation", () => {
          expect(makeMockQuery().cardinality).not.toBe(
            makeMockQuery().cardinality,
          )
        })
      })
    })

    describe("[attributes]", () => {
      describe("when an override is provided", () => {
        it("accepts the attributes override", () => {
          const attributes = {}

          expect(makeMockQuery({ attributes })).toHaveProperty(
            "attributes",
            attributes,
          )
        })
      })

      describe("when an override is not provided", () => {
        it("creates new attributes with each invocation", () => {
          expect(makeMockQuery().attributes).not.toBe(
            makeMockQuery().attributes,
          )
        })
      })
    })
  })
})
