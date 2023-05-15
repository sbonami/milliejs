import MillieJS from "../../src/index"
import MillieMemoryStore from "@milliejs/store-memory"
import {
  makeMockResource,
} from "@milliejs/jest-utils"

const resource = makeMockResource({})

describe("Millie create", () => {
  let millie: MillieJS
  let replicaStore: MillieMemoryStore
  let sourcePublisher: MillieMemoryStore
  beforeEach(() => {
    millie = new MillieJS()
    replicaStore = new MillieMemoryStore({})
    sourcePublisher = new MillieMemoryStore({})
    millie.registerResource(resource, replicaStore, {
      sourcePublisher,
    })
  })

  describe("when the client creates an entity", () => {
    it("creates the entity in the replicaStore", () => {
      const data = { a: "a" }

      const spy = jest.spyOn(replicaStore, "create")

      millie.create(resource, { resource, data })
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          resource,
          data,
        }),
      )
    })

    describe("when the replicaStore request takes a while", () => {
      beforeEach(() => {
        jest.spyOn(replicaStore, "create").mockImplementation((entity) => {
          return new Promise<typeof entity>((resolve) => {
            setTimeout(() => {
              resolve(entity)
            }, 1000)
          })
        })
      })

      it("still creates the entity in the source optimistically", () => {
        const data = { a: "a" }

        const spy = jest.spyOn(sourcePublisher, "create")

        millie.create(resource, { resource, data })
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            resource,
            data,
          }),
        )
      })

      describe("after the source succeeds with the create and returns the resource", () => {
        it.todo("updates the entity in the replicaStore")
      })
    })

    it("creates the entity in the source", () => {
      const data = { a: "a" }

      const spy = jest.spyOn(sourcePublisher, "create")

      millie.create(resource, { resource, data })
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          resource,
          data,
        }),
      )
    })

    describe("after the source succeeds with the create and returns the resource", () => {
      it.todo("updates the entity in the replicaStore")
    })

    describe("when the source request takes a while", () => {
      beforeEach(() => {
        jest.spyOn(sourcePublisher, "create").mockImplementation((entity) => {
          return new Promise<typeof entity>((resolve) => {
            setTimeout(() => {
              resolve(entity)
            }, 1000)
          })
        })
      })

      it("still creates the entity in the replicaStore optimistically", () => {
        const data = { a: "a" }

        const spy = jest.spyOn(replicaStore, "create")

        millie.create(resource, { resource, data })
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            resource,
            data,
          }),
        )
      })
    })
  })

  describe("when the source creates an entity", () => {
    it.todo("creates the entity in the replicaStore")
  })
})
