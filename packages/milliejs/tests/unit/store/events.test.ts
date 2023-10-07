import EventEmitter from "node:events"
import type { Entity, Resource } from "@milliejs/core"
import { LifecycleEvents } from "@milliejs/core"
import {
  makeMockEntity,
  makeMockQuery,
  makeMockResource,
} from "@milliejs/jest-utils"
import type { PublisherActionInterface } from "@milliejs/store-base"
import * as StoreBaseModule from "@milliejs/store-base"
import * as StoreEventModule from "../../../src/store/events"
import { makeMockPublisher } from "../mocks/publisher"

type MockResource = Resource
const mockResource = makeMockResource()

describe("events", () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  describe("isEventEmitter", () => {
    const { isEventEmitter } = StoreEventModule
    const conformingObject: EventEmitter = new EventEmitter()

    describe("when the passed object conforms to the EventEmitter interface", () => {
      it("should return true", () => {
        expect(isEventEmitter(conformingObject)).toBe(true)
      })
    })

    describe.each([
      ["addListener"],
      ["removeListener"],
      ["removeAllListeners"],
      ["setMaxListeners"],
      ["getMaxListeners"],
      ["listenerCount"],
      ["listeners"],
      ["rawListeners"],
      ["prependListener"],
      ["prependOnceListener"],
      ["eventNames"],
      ["on"],
      ["once"],
      ["off"],
      ["emit"],
    ])("[%s]", (methodName) => {
      describe(`when the passed object does not have a ${methodName} method`, () => {
        it("should return false", () => {
          const malformedObject = {
            ...conformingObject,
            [methodName]: undefined,
          }
          expect(isEventEmitter(malformedObject)).toBe(false)
        })
      })
    })
  })

  describe("isPublisherActionEventInterface", () => {
    const mockEntity = makeMockEntity<MockResource>({
      resource: mockResource,
    })
    const { isPublisherActionEventInterface } = StoreEventModule
    const conformingObject: EventEmitter &
      PublisherActionInterface<MockResource> = new (class extends EventEmitter {
      create() {
        return Promise.resolve(mockEntity)
      }
      read() {
        return Promise.resolve([])
      }
      update() {
        return Promise.resolve([])
      }
      patch() {
        return Promise.resolve([])
      }
      delete() {
        return Promise.resolve([])
      }
    })()

    describe("when the passed object conforms to the EventEmitter and PublisherActionEventInterface interfaces", () => {
      it("should return true", () => {
        expect(isPublisherActionEventInterface(conformingObject)).toBe(true)
      })
    })

    describe("when the passed object does not conform to the EventEmitter interface", () => {
      it("should return false", () => {
        const malformedObject = Object.getOwnPropertyNames(
          EventEmitter.prototype,
        ).reduce((_object, property) => {
          return { ...conformingObject, [property]: undefined }
        }, conformingObject)

        expect(isPublisherActionEventInterface(malformedObject)).toBe(false)
      })
    })

    describe("when the passed object does not conform to the PublisherActionEventInterface interface", () => {
      beforeEach(() => {
        jest
          .spyOn(StoreBaseModule, "isPublisherActionInterface")
          .mockReturnValue(false)
      })

      it("should return false", () => {
        expect(isPublisherActionEventInterface(conformingObject)).toBe(false)
      })
    })
  })

  describe("PublisherActionEventWrapper", () => {
    const { PublisherActionEventWrapper } = StoreEventModule
    const mockUneventfulStore = makeMockPublisher()
    let mockWrapper: StoreEventModule.PublisherActionEventInterface<MockResource> &
      StoreBaseModule.SubscriberActionInterface
    beforeEach(() => {
      mockWrapper = new PublisherActionEventWrapper<MockResource>(
        mockUneventfulStore,
      )
    })

    describe("create", () => {
      it("passes the entity to the store", () => {
        const mockInputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })

        ;(mockUneventfulStore as any).create.mockResolvedValue(mockOutputEntity)
        const actionSpy = jest.spyOn(
          PublisherActionEventWrapper.prototype,
          "create",
        )

        mockWrapper.create(mockInputEntity)
        expect(actionSpy).toHaveBeenCalledWith(mockInputEntity)
      })

      it("emits a 'save' event for the store's created entity", (done) => {
        expect.assertions(1)

        const mockInputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).create.mockResolvedValue(mockOutputEntity)

        mockWrapper.on(LifecycleEvents.Save, (entity: Entity<MockResource>) => {
          try {
            expect(entity).toBe(mockOutputEntity)
            done()
          } catch (error) {
            done(error)
          }
        })
        mockWrapper.create(mockInputEntity)
      })

      it("returns the store's created entity", () => {
        const mockInputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).create.mockResolvedValue(mockOutputEntity)

        expect(mockWrapper.create(mockInputEntity)).resolves.toBe(
          mockOutputEntity,
        )
      })
    })

    describe("read", () => {
      it("passes the query to the store", () => {
        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).read.mockResolvedValue([mockOutputEntity])
        const actionSpy = jest.spyOn(
          PublisherActionEventWrapper.prototype,
          "read",
        )

        mockWrapper.read(mockInputQuery)
        expect(actionSpy).toHaveBeenCalledWith(mockInputQuery)
      })

      it("returns the store's found entities", () => {
        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).read.mockResolvedValue([mockOutputEntity])

        expect(mockWrapper.read(mockInputQuery)).resolves.toEqual([
          mockOutputEntity,
        ])
      })
    })

    describe("update", () => {
      it("passes the Query and data payload to the store", () => {
        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockInputPayload = {}
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).update.mockResolvedValue([
          mockOutputEntity,
        ])
        const actionSpy = jest.spyOn(
          PublisherActionEventWrapper.prototype,
          "update",
        )

        mockWrapper.update(mockInputQuery, mockInputPayload)
        expect(actionSpy).toHaveBeenCalledWith(mockInputQuery, mockInputPayload)
      })

      it("emits a 'save' event for the store's updated entity", (done) => {
        expect.assertions(1)

        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockInputPayload = {}
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).update.mockResolvedValue([
          mockOutputEntity,
        ])

        mockWrapper.on(LifecycleEvents.Save, (entity: Entity<MockResource>) => {
          try {
            expect(entity).toBe(mockOutputEntity)
            done()
          } catch (error) {
            done(error)
          }
        })
        mockWrapper.update(mockInputQuery, mockInputPayload)
      })

      it("returns the store's updated entity", () => {
        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockInputPayload = {}
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).update.mockResolvedValue([
          mockOutputEntity,
        ])

        expect(
          mockWrapper.update(mockInputQuery, mockInputPayload),
        ).resolves.toEqual([mockOutputEntity])
      })
    })

    describe("patch", () => {
      it("passes the Query and patch to the store", () => {
        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockInputPatch = {}
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).patch.mockResolvedValue([
          mockOutputEntity,
        ])
        const actionSpy = jest.spyOn(
          PublisherActionEventWrapper.prototype,
          "patch",
        )

        mockWrapper.patch(mockInputQuery, mockInputPatch)
        expect(actionSpy).toHaveBeenCalledWith(mockInputQuery, mockInputPatch)
      })

      it("emits a 'save' event for the store's patched entity", (done) => {
        expect.assertions(1)

        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockInputPatch = {}
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).patch.mockResolvedValue([
          mockOutputEntity,
        ])

        mockWrapper.on(LifecycleEvents.Save, (entity: Entity<MockResource>) => {
          try {
            expect(entity).toBe(mockOutputEntity)
            done()
          } catch (error) {
            done(error)
          }
        })
        mockWrapper.patch(mockInputQuery, mockInputPatch)
      })

      it("returns the store's updated entity", () => {
        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockInputPatch = {}
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).update.mockResolvedValue([
          mockOutputEntity,
        ])

        expect(
          mockWrapper.update(mockInputQuery, mockInputPatch),
        ).resolves.toEqual([mockOutputEntity])
      })
    })

    describe("delete", () => {
      it("passes the Query to the store", () => {
        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).delete.mockResolvedValue([
          mockOutputEntity,
        ])
        const actionSpy = jest.spyOn(
          PublisherActionEventWrapper.prototype,
          "delete",
        )

        mockWrapper.delete(mockInputQuery)
        expect(actionSpy).toHaveBeenCalledWith(mockInputQuery)
      })

      it("emits a 'delete' event for the store's deleted entities", (done) => {
        expect.assertions(1)

        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).delete.mockResolvedValue([
          mockOutputEntity,
        ])

        mockWrapper.on(
          LifecycleEvents.Delete,
          (entity: Entity<MockResource>) => {
            try {
              expect(entity).toBe(mockOutputEntity)
              done()
            } catch (error) {
              done(error)
            }
          },
        )
        mockWrapper.delete(mockInputQuery)
      })

      it("returns the store's deleted entity", () => {
        const mockInputQuery = makeMockQuery({
          resource: mockResource,
        })
        const mockOutputEntity = makeMockEntity<MockResource>({
          resource: mockResource,
        })
        ;(mockUneventfulStore as any).delete.mockResolvedValue([
          mockOutputEntity,
        ])

        expect(mockWrapper.delete(mockInputQuery)).resolves.toEqual([
          mockOutputEntity,
        ])
      })
    })
  })
})
