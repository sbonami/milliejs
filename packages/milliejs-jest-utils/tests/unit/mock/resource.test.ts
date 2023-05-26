import { faker } from "@faker-js/faker"
import { makeMockResource } from "../../../src/mocks/resource"

describe("mocks/resource.ts", () => {
  describe("makeMockResource", () => {
    describe("[id]", () => {
      describe("when an override is provided", () => {
        it("accepts the id override", () => {
          const id = faker.datatype.uuid()

          expect(makeMockResource({ id })).toHaveProperty("id", id)
        })
      })

      describe("when an override is not provided", () => {
        it("creates a new id with each invocation", () => {
          expect(makeMockResource().id).not.toBe(makeMockResource().id)
        })
      })
    })
  })
})
