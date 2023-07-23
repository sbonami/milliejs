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
const patch = [
  {
    op: "replace",
    path: "/a",
    value: "AAA",
  },
]

describe("Millie patch", () => {
  let millie: MillieJS
  let replicaStore: MillieMemoryStore<typeof mockResource>
  let sourcePublisher: MillieMemoryStore<typeof mockResource>
  beforeEach(() => {
    millie = new MillieJS()
    replicaStore = new MillieMemoryStore({})
    sourcePublisher = new MillieMemoryStore({})
    millie.registerResource(mockResource, replicaStore, {
      sourcePublisher,
    })

    const seed = [[mockEntity.id, mockEntity]] as const
    replicaStore.store.set(mockResource.id, new Map(seed))
    sourcePublisher.store.set(mockResource.id, new Map(seed))
  })

  describe("when the client patches entities", () => {
    describe.each<[string, Entity<Resource> | Query]>([
      ["a query", mockQuery],
      ["an entity", mockEntity],
    ])("via %s", (_, entityOrQueryProp) => {
      it("patches the entities in the replicaStore", () => {
        const spy = jest.spyOn(replicaStore, "patch")

        millie.patch(mockResource, entityOrQueryProp, patch)
        expect(spy).toHaveBeenCalledWith(entityOrQueryProp, patch)
      })

      describe("when the replicaStore succeeds", () => {
        it.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
          "emits a %s event with the replicaStore's patched entity",
          (event) => {
            expect.assertions(2)

            jest.spyOn(replicaStore, "patch")

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

              return millie.patch(mockResource, entityOrQueryProp, patch)
            })
          },
        )
      })

      describe("when the replicaStore request takes a while", () => {
        beforeEach(() => {
          jest.spyOn(replicaStore, "patch").mockImplementation(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([mockEntity])
              }, 1000)
            })
          })
        })

        it("still patches the entities in the source optimistically", () => {
          const spy = jest.spyOn(sourcePublisher, "patch")

          millie.patch(mockResource, entityOrQueryProp, patch)
          expect(spy).toHaveBeenCalledWith(entityOrQueryProp, patch)
        })

        it.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
          "still emits a %s event with the replicaStore's patched entity",
          (event) => {
            expect.assertions(2)

            jest.spyOn(replicaStore, "patch")

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

              return millie.patch(mockResource, entityOrQueryProp, patch)
            })
          },
        )

        describe("after the source succeeds with the patch and returns the patched entities", () => {
          it.skip.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
            "emits a %s event with the source's patched entity",

            () => {},
          )

          it.todo("updates the entities in the replicaStore")
        })
      })

      it("patches the entities in the source", () => {
        const spy = jest.spyOn(sourcePublisher, "patch")

        millie.patch(mockResource, entityOrQueryProp, patch)

        expect(spy).toHaveBeenCalledWith(entityOrQueryProp, patch)
      })

      describe("after the source succeeds with the patch and returns the patched entities", () => {
        it.todo("updates the entities in the replicaStore")
      })

      describe("when the source request takes a while", () => {
        beforeEach(() => {
          jest.spyOn(sourcePublisher, "patch").mockImplementation(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([mockEntity])
              }, 1000)
            })
          })
        })

        it("still patches the entities in the replicaStore optimistically", () => {
          const spy = jest.spyOn(replicaStore, "patch")

          millie.patch(mockResource, entityOrQueryProp, patch)
          expect(spy).toHaveBeenCalledWith(entityOrQueryProp, patch)
        })

        it.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
          "still emits a %s event with the replicaStore's patched entity",
          (event) => {
            expect.assertions(2)

            jest.spyOn(replicaStore, "patch")

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

              return millie.patch(mockResource, entityOrQueryProp, patch)
            })
          },
        )
      })
    })
  })

  describe("when the source patches entities", () => {
    it.todo("patches the entities in the replicaStore")
  })
})
