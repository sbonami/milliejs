import { EventEmitter } from "node:events"
import MillieJS, { Entity, LifecycleEvents, Resource } from "../../src/index"
import MillieMemoryStore from "@milliejs/store-memory"
import { makeMockResource } from "@milliejs/jest-utils"
import asyncCallback from "./helpers/asyncCallback"

const mockResource = makeMockResource({})

describe("Millie create", () => {
  let millie: MillieJS
  let replicaStore: MillieMemoryStore
  let sourcePublisher: MillieMemoryStore
  let sourceSubscriber: EventEmitter
  beforeEach(() => {
    millie = new MillieJS()
    replicaStore = new MillieMemoryStore({})
    sourcePublisher = new MillieMemoryStore({})
    sourceSubscriber = new EventEmitter()
    millie.registerResource(mockResource, replicaStore, {
      sourcePublisher,
      sourceSubscriber,
    })
  })

  describe("when the client creates an entity", () => {
    it("creates the entity in the replicaStore", () => {
      const data = { a: "a" }

      const spy = jest.spyOn(replicaStore, "create")

      millie.create(mockResource, { resource: mockResource, data })
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: mockResource,
          data,
        }),
      )
    })

    describe("when the replicaStore succeeds", () => {
      it.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
        "emits a %s event with the replicaStore's created entity",
        (event) => {
          expect.assertions(2)

          const data = { a: "a" }

          jest.spyOn(replicaStore, "create")

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

            return millie.create(mockResource, { resource: mockResource, data })
          })
        },
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

        millie.create(mockResource, { resource: mockResource, data })
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            resource: mockResource,
            data,
          }),
        )
      })

      it.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
        "still emits a %s event with the replicaStore's created entity",
        (event) => {
          expect.assertions(2)

          const data = { a: "a" }

          jest.spyOn(replicaStore, "create")

          return asyncCallback((done) => {
            millie.once(
              mockResource,
              event,
              (resource: Resource, entity: Entity<Resource>) => {
                try {
                  expect(resource).toEqual(mockResource)
                  expect(entity).toEqual(
                    expect.objectContaining({
                      resource,
                      data,
                    }),
                  )
                  done()
                } catch (error) {
                  done(error)
                }
              },
            )

            return millie.create(mockResource, { resource: mockResource, data })
          })
        },
      )

      describe("after the source succeeds with the create and returns the resource", () => {
        it.skip.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
          "emits a %s event with the source's created entity",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
        )

        it.todo("updates the entity in the replicaStore")
      })
    })

    it("creates the entity in the source", () => {
      const data = { a: "a" }

      const spy = jest.spyOn(sourcePublisher, "create")

      millie.create(mockResource, { resource: mockResource, data })
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: mockResource,
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

        millie.create(mockResource, { resource: mockResource, data })
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            resource: mockResource,
            data,
          }),
        )
      })

      it.each([[LifecycleEvents.Save], [LifecycleEvents.Delta]])(
        "still emits a %s event with the replicaStore's created entity",
        (event) => {
          expect.assertions(2)

          const data = { a: "a" }

          jest.spyOn(replicaStore, "create")

          return asyncCallback((done) => {
            millie.once(
              mockResource,
              event,
              (resource: Resource, entity: Entity<Resource>) => {
                try {
                  expect(resource).toEqual(mockResource)
                  expect(entity).toEqual(
                    expect.objectContaining({
                      resource,
                      data,
                    }),
                  )
                  done()
                } catch (error) {
                  done(error)
                }
              },
            )

            return millie.create(mockResource, { resource: mockResource, data })
          })
        },
      )
    })
  })

  describe("when the source creates an entity", () => {
    it.todo("creates the entity in the replicaStore")
  })
})
