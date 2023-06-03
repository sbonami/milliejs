import { faker } from "@faker-js/faker"
import { makeMockEntity } from "../../../src/mocks/entity"
import * as MockResourceModule from "../../../src/mocks/resource"

const { makeMockResource } = MockResourceModule

describe("mocks/entity.ts", () => {
  describe("makeMockEntity", () => {
    describe("[id]", () => {
      describe("when an override is provided", () => {
        it("accepts the id override", () => {
          const id = faker.string.uuid()

          expect(makeMockEntity({ id })).toHaveProperty("id", id)
        })
      })

      describe("when an override is not provided", () => {
        it("creates a new id with each invocation", () => {
          expect(makeMockEntity().id).not.toBe(makeMockEntity().id)
        })
      })
    })

    describe("[resource]", () => {
      describe("when an override is provided", () => {
        it("accepts the resource override", () => {
          const resource = makeMockResource()

          expect(makeMockEntity({ resource })).toHaveProperty(
            "resource",
            resource,
          )
        })
      })

      describe("when an override is not provided", () => {
        it("creates a new resource with each invocation", () => {
          expect(makeMockEntity().resource).not.toBe(makeMockEntity().resource)
        })

        it("uses the makeMockResource factory to create a valid mock resource", () => {
          const mockResource = makeMockResource()
          jest
            .spyOn(MockResourceModule, "makeMockResource")
            .mockReturnValue(mockResource)

          expect(makeMockEntity()).toHaveProperty("resource", mockResource)
        })
      })
    })

    describe("[data]", () => {
      describe("when an override is provided", () => {
        it("accepts the data override", () => {
          const data = jest.fn()

          expect(makeMockEntity({ data })).toHaveProperty("data", data)
        })
      })

      describe("when an override is not provided", () => {
        it("creates new data with each invocation", () => {
          expect(makeMockEntity().data).not.toBe(makeMockEntity().data)
        })
      })
    })
  })
})
