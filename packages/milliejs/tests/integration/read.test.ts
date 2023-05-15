import MillieJS, { Entity, Query, Resource } from "../../src/index"
import MillieMemoryStore from "@milliejs/store-memory"

const resource: Resource = {
  id: "person",
}
const query: Query = {
  resource,
  cardinality: "many",
  attributes: {
    a: "a",
  },
}
const entity: Entity<Resource> = {
  id: "1",
  resource,
  data: {
    a: "a",
  },
}
const data = {}

describe("Millie read", () => {
  let millie: MillieJS
  let replicaStore: MillieMemoryStore
  let sourcePublisher: MillieMemoryStore
  beforeEach(() => {
    millie = new MillieJS()
    replicaStore = new MillieMemoryStore({})
    replicaStore.store.set(resource.id, new Map())
    sourcePublisher = new MillieMemoryStore({})
    sourcePublisher.store.set(resource.id, new Map())
    millie.registerResource(resource, replicaStore, {
      sourcePublisher,
    })
  })

  describe("when the client reads entities", () => {
    it("reads the entities from the replicaStore", () => {
      const spy = jest.spyOn(replicaStore, "read")

      millie.read(resource, query)
      expect(spy).toHaveBeenCalledWith(query)
    })

    describe("when the replicaStore request takes a while", () => {
      beforeEach(() => {
        jest.spyOn(replicaStore, "read").mockImplementation((query) => {
          return new Promise<any>((resolve) => {
            setTimeout(() => {
              resolve([entity])
            }, 1000)
          })
        })
      })

      it("still reads the entities in the source optimistically", () => {
        const spy = jest.spyOn(sourcePublisher, "read")

        millie.read(resource, query)
        expect(spy).toHaveBeenCalledWith(query)
      })

      describe("after the source succeeds with the read and returns the found entities", () => {
        it.todo("reads the entities in the replicaStore")
      })
    })

    it("reads the entities in the source", () => {
      const spy = jest.spyOn(sourcePublisher, "read")

      millie.read(resource, query)

      expect(spy).toHaveBeenCalledWith(query)
    })

    describe("after the source succeeds with the read and returns the found entities", () => {
      it.todo("upserts the entities in the replicaStore")
    })

    describe("when the source request takes a while", () => {
      beforeEach(() => {
        jest.spyOn(sourcePublisher, "read").mockImplementation((query) => {
          return new Promise<any>((resolve) => {
            setTimeout(() => {
              resolve([entity])
            }, 1000)
          })
        })
      })

      it("still reads the entities from the replicaStore optimistically", () => {
        const spy = jest.spyOn(replicaStore, "read")

        millie.read(resource, query)
        expect(spy).toHaveBeenCalledWith(query)
      })
    })
  })
})
