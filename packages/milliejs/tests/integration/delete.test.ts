import MillieJS, {
  Entity,
  LifecycleEvents,
  Query,
  Resource,
} from "../../src/index"
import MillieMemoryStore from "@milliejs/store-memory"
import {
  asyncCallback,
  makeMockEntity,
  makeMockQuery,
  makeMockResource,
} from "@milliejs/jest-utils"

jest.mock("../../src/worker")

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

describe("Millie delete", () => {
  let millie: MillieJS
  let replicaStore: MillieMemoryStore<typeof mockResource>
  let sourcePublisher: MillieMemoryStore<typeof mockResource>
  beforeEach(() => {
    millie = new MillieJS()
    replicaStore = new MillieMemoryStore({})
    replicaStore.store.set(mockResource.id, new Map())
    sourcePublisher = new MillieMemoryStore({})
    sourcePublisher.store.set(mockResource.id, new Map())
    millie.registerResource(mockResource, replicaStore, {
      sourcePublisher,
    })

    const seed = [[mockEntity.id, mockEntity]] as const
    replicaStore.store.set(mockResource.id, new Map(seed))
    sourcePublisher.store.set(mockResource.id, new Map(seed))
  })

  describe("when the client deletes entities", () => {
    describe.each<[string, Entity<Resource> | Query]>([
      ["a query", mockQuery],
      ["an entity", mockEntity],
    ])("via %s", (_, entityOrQueryProp) => {
      it("deletes the entities in the replicaStore", () => {
        const spy = jest.spyOn(replicaStore, "delete")

        millie.delete(mockResource, entityOrQueryProp)
        expect(spy).toHaveBeenCalledWith(entityOrQueryProp)
      })

      describe("when the replicaStore deletion succeeds", () => {
        it.each([[LifecycleEvents.Delete]])(
          "emits a %s event with the replicaStore's deleted entity",
          (event) => {
            expect.assertions(2)

            const data = { a: "a" }

            jest.spyOn(replicaStore, "delete")

            return asyncCallback((done) => {
              millie.once(
                mockResource,
                event,
                (resource: Resource, entity: Entity<Resource>) => {
                  try {
                    expect(resource).toEqual(mockResource)
                    expect(entity).toEqual(
                      expect.objectContaining({
                        resource: mockResource,
                        data,
                      }),
                    )
                    done()
                  } catch (error) {
                    done(error)
                  }
                },
              )

              return millie.delete(mockResource, entityOrQueryProp)
            })
          },
        )
      })

      describe("when the replicaStore request takes a while", () => {
        beforeEach(() => {
          jest.spyOn(replicaStore, "delete").mockImplementation(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([mockEntity])
              }, 1000)
            })
          })
        })

        it("still deletes the entities in the source optimistically", () => {
          const spy = jest.spyOn(sourcePublisher, "delete")

          millie.delete(mockResource, entityOrQueryProp)
          expect(spy).toHaveBeenCalledWith(entityOrQueryProp)
        })

        describe("after the source succeeds with the delete", () => {
          describe("and returns the deleted entities", () => {
            it.todo("deletes the returned entities from the replicaStore")
          })

          describe("and returns `true`", () => {
            it.todo("returns true")
          })
        })
      })

      it("deletes the entities in the source", () => {
        const spy = jest.spyOn(sourcePublisher, "delete")

        millie.delete(mockResource, entityOrQueryProp)

        expect(spy).toHaveBeenCalledWith(entityOrQueryProp)
      })

      describe("after the source succeeds with the delete", () => {
        describe("and returns the deleted entities", () => {
          it.todo("deletes the returned entities from the replicaStore")
        })

        describe("and returns `true`", () => {
          it.todo("returns true")
        })
      })

      describe("when the source request takes a while", () => {
        beforeEach(() => {
          jest.spyOn(sourcePublisher, "delete").mockImplementation(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([mockEntity])
              }, 1000)
            })
          })
        })

        it("still deletes the entities in the replicaStore optimistically", () => {
          const spy = jest.spyOn(replicaStore, "delete")

          millie.delete(mockResource, entityOrQueryProp)
          expect(spy).toHaveBeenCalledWith(entityOrQueryProp)
        })
      })
    })
  })

  describe("when the source deletes entities", () => {
    it.todo("deletes the entities in the replicaStore")
  })
})
