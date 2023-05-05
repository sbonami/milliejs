import MillieJS, { Entity, Query, Resource } from "../../src/index"
import MillieMemoryStore from "../../../milliejs-store-memory/src/index"

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

describe("Millie update", () => {
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

  describe("when the client updates entities", () => {
    describe.each<[string, Entity<Resource> | Query]>([
      ["a query", query],
      ["an entity", entity],
    ])("via %s", (_, entityOrQueryProp) => {
      it("updates the entities in the replicaStore", () => {
        const spy = jest.spyOn(replicaStore, "update")

        millie.update(resource, entityOrQueryProp, data)
        expect(spy).toHaveBeenCalledWith(entityOrQueryProp, data)
      })

      describe("when the replicaStore request takes a while", () => {
        beforeEach(() => {
          jest
            .spyOn(replicaStore, "update")
            .mockImplementation((entityOrQuery, data) => {
              return new Promise<any>((resolve) => {
                setTimeout(() => {
                  resolve([entity])
                }, 1000)
              })
            })
        })

        it("still updates the entities in the source optimistically", () => {
          const spy = jest.spyOn(sourcePublisher, "update")

          millie.update(resource, entityOrQueryProp, data)
          expect(spy).toHaveBeenCalledWith(entityOrQueryProp, data)
        })

        describe("after the source succeeds with the update and returns the updated entities", () => {
          it.todo("updates the entities in the replicaStore")
        })
      })

      it("updates the entities in the source", () => {
        const spy = jest.spyOn(sourcePublisher, "update")

        millie.update(resource, entityOrQueryProp, data)

        expect(spy).toHaveBeenCalledWith(entityOrQueryProp, data)
      })

      describe("after the source succeeds with the update and returns the updated entities", () => {
        it.todo("updates the entities in the replicaStore")
      })

      describe("when the source request takes a while", () => {
        beforeEach(() => {
          jest
            .spyOn(sourcePublisher, "update")
            .mockImplementation((entityOrQuery, data) => {
              return new Promise<any>((resolve) => {
                setTimeout(() => {
                  resolve([entity])
                }, 1000)
              })
            })
        })

        it("still updates the entities in the replicaStore optimistically", () => {
          const spy = jest.spyOn(replicaStore, "update")

          millie.update(resource, entityOrQueryProp, data)
          expect(spy).toHaveBeenCalledWith(entityOrQueryProp, data)
        })
      })
    })
  })

  describe("when the source updates entities", () => {
    it.todo("updates the entities in the replicaStore")
  })
})
