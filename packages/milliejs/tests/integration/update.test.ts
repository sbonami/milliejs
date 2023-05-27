import MillieJS, {
  Entity,
  LifecycleEvents,
  Query,
  Resource,
} from "../../src/index"
import MillieMemoryStore from "@milliejs/store-memory"
import {
  makeMockEntity,
  makeMockQuery,
  makeMockResource,
} from "@milliejs/jest-utils"
import asyncCallback from "./helpers/asyncCallback"

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
const data = {
  a: "AAA",
}

describe("Millie update", () => {
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

  describe("when the client updates entities", () => {
    describe.each<[string, Entity<Resource> | Query]>([
      ["a query", mockQuery],
      ["an entity", mockEntity],
    ])("via %s", (_, entityOrQueryProp) => {
      it("updates the entities in the replicaStore", () => {
        const spy = jest.spyOn(replicaStore, "update")

        millie.update(mockResource, entityOrQueryProp, data)
        expect(spy).toHaveBeenCalledWith(entityOrQueryProp, data)
      })

      describe("when the replicaStore succeeds", () => {
        it.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
          "emits a %s event with the replicaStore's patched entity",
          (event) => {
            expect.assertions(2)

            jest.spyOn(replicaStore, "update")

            return asyncCallback((done) => {
              millie.once(
                mockResource,
                event,
                (resource: Resource, entity: Entity<Resource>) => {
                  try {
                    expect(resource).toEqual(mockResource)
                    expect(entity).toEqual(
                      expect.objectContaining({
                        ...mockEntity,
                        data: {
                          ...mockEntity.data,
                          a: "AAA",
                        },
                      }),
                    )
                    done()
                  } catch (error) {
                    done(error)
                  }
                },
              )

              return millie.update(mockResource, entityOrQueryProp, data)
            })
          },
        )
      })

      describe("when the replicaStore request takes a while", () => {
        beforeEach(() => {
          jest.spyOn(replicaStore, "update").mockImplementation(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([mockEntity])
              }, 1000)
            })
          })
        })

        it("still updates the entities in the source optimistically", () => {
          const spy = jest.spyOn(sourcePublisher, "update")

          millie.update(mockResource, entityOrQueryProp, data)
          expect(spy).toHaveBeenCalledWith(entityOrQueryProp, data)
        })

        it.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
          "still emits a %s event with the replicaStore's patched entity",
          (event) => {
            expect.assertions(2)

            jest.spyOn(replicaStore, "update")

            return asyncCallback((done) => {
              millie.once(
                mockResource,
                event,
                (resource: Resource, entity: Entity<Resource>) => {
                  try {
                    expect(resource).toEqual(mockResource)
                    expect(entity).toEqual(
                      expect.objectContaining({
                        ...mockEntity,
                        data: {
                          ...mockEntity.data,
                          a: "AAA",
                        },
                      }),
                    )
                    done()
                  } catch (error) {
                    done(error)
                  }
                },
              )

              return millie.update(mockResource, entityOrQueryProp, data)
            })
          },
        )

        describe("after the source succeeds with the update and returns the updated entities", () => {
          it.skip.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
            "emits a %s event with the source's updated entity",
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            () => {},
          )

          it.todo("updates the entities in the replicaStore")
        })
      })

      it("updates the entities in the source", () => {
        const spy = jest.spyOn(sourcePublisher, "update")

        millie.update(mockResource, entityOrQueryProp, data)

        expect(spy).toHaveBeenCalledWith(entityOrQueryProp, data)
      })

      describe("after the source succeeds with the update and returns the updated entities", () => {
        it.todo("updates the entities in the replicaStore")
      })

      describe("when the source request takes a while", () => {
        beforeEach(() => {
          jest.spyOn(sourcePublisher, "update").mockImplementation(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([mockEntity])
              }, 1000)
            })
          })
        })

        it("still updates the entities in the replicaStore optimistically", () => {
          const spy = jest.spyOn(replicaStore, "update")

          millie.update(mockResource, entityOrQueryProp, data)
          expect(spy).toHaveBeenCalledWith(entityOrQueryProp, data)
        })

        it.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
          "still emits a %s event with the replicaStore's patched entity",
          (event) => {
            expect.assertions(2)

            jest.spyOn(replicaStore, "update")

            return asyncCallback((done) => {
              millie.once(
                mockResource,
                event,
                (resource: Resource, entity: Entity<Resource>) => {
                  try {
                    expect(resource).toEqual(mockResource)
                    expect(entity).toEqual(
                      expect.objectContaining({
                        ...mockEntity,
                        data: {
                          ...mockEntity.data,
                          a: "AAA",
                        },
                      }),
                    )
                    done()
                  } catch (error) {
                    done(error)
                  }
                },
              )

              return millie.update(mockResource, entityOrQueryProp, data)
            })
          },
        )
      })
    })
  })

  describe("when the source updates entities", () => {
    it.todo("updates the entities in the replicaStore")
  })
})
