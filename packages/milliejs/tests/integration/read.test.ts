import MillieJS from "../../src/index"
import MillieMemoryStore from "@milliejs/store-memory"
import {
  makeMockEntity,
  makeMockQuery,
  makeMockResource,
} from "@milliejs/jest-utils"

const mockResource = makeMockResource({})
const mockQuery = makeMockQuery({
  resource: mockResource,
  cardinality: "many",
  attributes: {
    a: "a",
  },
})
const mockEntity = makeMockEntity({
  resource: mockResource,
  data: {
    a: "a",
  },
})

describe("Millie read", () => {
  let millie: MillieJS
  let replicaStore: MillieMemoryStore
  let sourcePublisher: MillieMemoryStore
  beforeEach(() => {
    millie = new MillieJS()
    replicaStore = new MillieMemoryStore({})
    replicaStore.store.set(mockResource.id, new Map())
    sourcePublisher = new MillieMemoryStore({})
    sourcePublisher.store.set(mockResource.id, new Map())
    millie.registerResource(mockResource, replicaStore, {
      sourcePublisher,
    })
  })

  describe("when the client reads entities", () => {
    it("reads the entities from the replicaStore", () => {
      const spy = jest.spyOn(replicaStore, "read")

      millie.read(mockResource, mockQuery)
      expect(spy).toHaveBeenCalledWith(mockQuery)
    })

    describe("when the replicaStore request takes a while", () => {
      beforeEach(() => {
        jest.spyOn(replicaStore, "read").mockImplementation((query) => {
          return new Promise<any>((resolve) => {
            setTimeout(() => {
              resolve([mockEntity])
            }, 1000)
          })
        })
      })

      it("still reads the entities in the source optimistically", () => {
        const spy = jest.spyOn(sourcePublisher, "read")

        millie.read(mockResource, mockQuery)
        expect(spy).toHaveBeenCalledWith(mockQuery)
      })

      describe("after the source succeeds with the read and returns the found entities", () => {
        it.todo("reads the entities in the replicaStore")
      })
    })

    it("reads the entities in the source", () => {
      const spy = jest.spyOn(sourcePublisher, "read")

      millie.read(mockResource, mockQuery)

      expect(spy).toHaveBeenCalledWith(mockQuery)
    })

    describe("after the source succeeds with the read and returns the found entities", () => {
      it.todo("upserts the entities in the replicaStore")
    })

    describe("when the source request takes a while", () => {
      beforeEach(() => {
        jest.spyOn(sourcePublisher, "read").mockImplementation((query) => {
          return new Promise<any>((resolve) => {
            setTimeout(() => {
              resolve([mockEntity])
            }, 1000)
          })
        })
      })

      it("still reads the entities from the replicaStore optimistically", () => {
        const spy = jest.spyOn(replicaStore, "read")

        millie.read(mockResource, mockQuery)
        expect(spy).toHaveBeenCalledWith(mockQuery)
      })
    })
  })
})
