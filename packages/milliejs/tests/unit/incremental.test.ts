import type { Resource } from "@milliejs/core"
import {
  makeMockEntity,
  makeMockQuery,
  makeMockResource,
} from "@milliejs/jest-utils"
import { IncrementalStore } from "../../src/incremental"
import * as events from "../../src/store/events"
import {
  makeMockPublisher,
  makeMockPublisherWithEvents,
} from "./mocks/publisher"
import { makeMockSubscriber } from "./mocks/subscriber"

import { CreateAction } from "../../src/incremental/actions/create"
import { ReadAction } from "../../src/incremental/actions/read"
import { UpdateAction } from "../../src/incremental/actions/update"
import { PatchAction } from "../../src/incremental/actions/patch"
import { DeleteAction } from "../../src/incremental/actions/delete"

jest.mock("../../src/incremental/deltaEventForwarder")
jest.mock("../../src/incremental/replicaEventPulldown")
jest.mock("../../src/store/events")

type MockResource = Resource

describe("IncrementalStore", () => {
  describe("new IncrementalStore", () => {
    it("should create an instance of IncrementalStore", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisher()

      const store = new IncrementalStore<MockResource>(
        mockResource,
        mockReplicaStore,
        {
          sourcePublisher: makeMockPublisher(),
          sourceSubscriber: makeMockSubscriber(),
        },
      )

      expect(store).toBeInstanceOf(IncrementalStore)
      expect(store.resource).toBe(mockResource)
    })

    describe("when the store is instantiated without the sourceInterface options", () => {
      it("should create an instance of IncrementalStore with undefined sourceInterfaces", () => {
        const mockResource = makeMockResource()
        const mockReplicaStore = makeMockPublisher()

        const store = new IncrementalStore(mockResource, mockReplicaStore)

        expect(store).toBeInstanceOf(IncrementalStore)
        expect(store.resource).toBe(mockResource)
        expect(store["sourcePublisher"]).toBeUndefined()
        expect(store["sourceSubscriber"]).toBeUndefined()
      })
    })

    describe("[replicaStore]", () => {
      describe("when the provided replicaStore is also an event interface", () => {
        beforeEach(() => {
          ;(events.isPublisherActionEventInterface as any).mockReturnValue(true)
        })

        it("should set the replicaStore directly", () => {
          const mockResource = makeMockResource()
          const mockReplicaStore = makeMockPublisherWithEvents()

          const store = new IncrementalStore(mockResource, mockReplicaStore)

          expect(store["_replicaStore"]).toBe(mockReplicaStore)
        })
      })

      describe("when the provided replicaStore does not provide an event interface", () => {
        it("should set the replicaStore wrapped by the PublisherActionEventWrapper", () => {
          const mockResource = makeMockResource()
          const mockReplicaStore = makeMockPublisher()
          const mockWrappedReplicaStore =
            makeMockPublisherWithEvents() as unknown as jest.Mocked<
              events.PublisherActionEventWrapper<MockResource>
            >
          const wrapperSpy = jest
            .spyOn(events, "PublisherActionEventWrapper")
            .mockReturnValue(mockWrappedReplicaStore)

          const store = new IncrementalStore(mockResource, mockReplicaStore)

          expect(wrapperSpy).toHaveBeenCalledWith(mockReplicaStore)
          expect(store["_replicaStore"]).toBe(mockWrappedReplicaStore)
        })
      })
    })

    describe("[sourcePublisher]", () => {
      describe("when the store is instantiated with only the sourcePublisher interface option", () => {
        describe("when the provided sourcePublisher is also an event interface", () => {
          beforeEach(() => {
            ;(events.isPublisherActionEventInterface as any).mockReturnValue(
              true,
            )
          })

          it("should create an instance of IncrementalStore with the sourcePublisher", () => {
            const mockResource = makeMockResource()
            const mockReplicaStore = makeMockPublisherWithEvents()
            const mockSourcePublisher = makeMockPublisherWithEvents()

            const store = new IncrementalStore(mockResource, mockReplicaStore, {
              sourcePublisher: mockSourcePublisher,
            })

            expect(store).toBeInstanceOf(IncrementalStore)
            expect(store.resource).toBe(mockResource)
            expect(store["_replicaStore"]).toBe(mockReplicaStore)
            expect(store["_sourcePublisher"]).toBe(mockSourcePublisher)
            expect(store["_sourceSubscriber"]).toBeUndefined()
          })
        })

        describe("when the provided sourcePublisher does not provide an event interface", () => {
          it("should create an instance of IncrementalStore with the sourcePublisher wrapped by the PublisherActionEventWrapper", () => {
            const mockResource = makeMockResource()
            const mockReplicaStore = makeMockPublisherWithEvents()
            const mockSourcePublisher = makeMockPublisher()
            const mockWrappedSourcePublisher =
              makeMockPublisherWithEvents() as unknown as jest.Mocked<
                events.PublisherActionEventWrapper<MockResource>
              >
            const wrapperSpy = jest
              .spyOn(events, "PublisherActionEventWrapper")
              .mockReturnValue(mockWrappedSourcePublisher)

            const store = new IncrementalStore(mockResource, mockReplicaStore, {
              sourcePublisher: mockSourcePublisher,
            })

            expect(wrapperSpy).toHaveBeenCalledWith(mockSourcePublisher)
            expect(store["_sourcePublisher"]).toBe(mockWrappedSourcePublisher)
          })
        })
      })
    })

    describe("[sourceSubscriber]", () => {
      describe("when the store is instantiated with only the sourceSubscriber interface option", () => {
        beforeEach(() => {
          ;(events.isPublisherActionEventInterface as any).mockReturnValue(true)
        })

        it("should create an instance of IncrementalStore with only sourceSubscriber", () => {
          const mockResource = makeMockResource()
          const mockReplicaStore = makeMockPublisherWithEvents()
          const mockSourceSubscriber = makeMockSubscriber()

          const store = new IncrementalStore(mockResource, mockReplicaStore, {
            sourceSubscriber: mockSourceSubscriber,
          })

          expect(store).toBeInstanceOf(IncrementalStore)
          expect(store.resource).toBe(mockResource)
          expect(store["_replicaStore"]).toBe(mockReplicaStore)
          expect(store["_sourcePublisher"]).toBeUndefined()
          expect(store["_sourceSubscriber"]).toBe(mockSourceSubscriber)
        })
      })
    })
  })

  describe("get [replicaStore]", () => {
    it("returns the IncrementalStore's _replicaStore", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourcePublisher: mockSourcePublisher,
        sourceSubscriber: mockSourceSubscriber,
      })

      expect(store.replicaStore).toBe(store["_replicaStore"])
    })
  })

  describe("set [sourcePublisher]", () => {
    describe("when the new sourcePublisher is undefined", () => {
      it("updates the Incremental Store's _sourcePublisher to undefined", () => {
        const mockResource = makeMockResource()
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()
        const mockSourceSubscriber = makeMockSubscriber()
        const store = new IncrementalStore(mockResource, mockReplicaStore, {
          sourcePublisher: mockSourcePublisher,
          sourceSubscriber: mockSourceSubscriber,
        })

        store.sourcePublisher = undefined

        expect(store["_sourcePublisher"]).toBeUndefined()
      })
    })

    describe("when the new sourcePublisher is also an event interface", () => {
      beforeEach(() => {
        ;(events.isPublisherActionEventInterface as any).mockReturnValue(true)
      })

      it("updates the Incremental Store's _sourcePublisher to the provided sourcePublisher", () => {
        const mockResource = makeMockResource()
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()
        const mockSourceSubscriber = makeMockSubscriber()
        const store = new IncrementalStore(mockResource, mockReplicaStore, {
          sourcePublisher: mockSourcePublisher,
          sourceSubscriber: mockSourceSubscriber,
        })

        const newSourcePublisher = makeMockPublisherWithEvents()
        store.sourcePublisher = newSourcePublisher

        expect(store["_sourcePublisher"]).toBe(newSourcePublisher)
      })
    })

    describe("when the new sourcePublisher does not provide an event interface", () => {
      it("updates the Incremental Store's _sourcePublisher to the sourcePublisher wrapped by the PublisherActionEventWrapper", () => {
        const mockResource = makeMockResource()
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()
        const mockSourceSubscriber = makeMockSubscriber()
        const store = new IncrementalStore(mockResource, mockReplicaStore, {
          sourcePublisher: mockSourcePublisher,
          sourceSubscriber: mockSourceSubscriber,
        })
        const mockWrappedSourcePublisher =
          makeMockPublisherWithEvents() as unknown as jest.Mocked<
            events.PublisherActionEventWrapper<MockResource>
          >
        const wrapperSpy = jest
          .spyOn(events, "PublisherActionEventWrapper")
          .mockReturnValue(mockWrappedSourcePublisher)

        const newSourcePublisher = makeMockPublisher()
        store.sourcePublisher = newSourcePublisher

        expect(wrapperSpy).toHaveBeenCalledWith(newSourcePublisher)
        expect(store["_sourcePublisher"]).toBe(mockWrappedSourcePublisher)
      })
    })
  })

  describe("get [sourcePublisher]", () => {
    it("returns the IncrementalStore's _sourcePublisher", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourcePublisher: mockSourcePublisher,
        sourceSubscriber: mockSourceSubscriber,
      })

      expect(store.sourcePublisher).toBe(store["_sourcePublisher"])
    })
  })

  describe("set [sourceSubscriber]", () => {
    it("updates the Incremental Store's _sourceSubscriber", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourcePublisher: mockSourcePublisher,
        sourceSubscriber: mockSourceSubscriber,
      })

      const newSourceSubscriber = makeMockSubscriber()
      store.sourceSubscriber = newSourceSubscriber

      expect(store["_sourceSubscriber"]).toBe(newSourceSubscriber)
    })

    describe("when the new sourceSubscriber is undefined", () => {
      it("updates the Incremental Store's _sourceSubscriber to undefined", () => {
        const mockResource = makeMockResource()
        const mockReplicaStore = makeMockPublisherWithEvents()
        const mockSourcePublisher = makeMockPublisherWithEvents()
        const mockSourceSubscriber = makeMockSubscriber()
        const store = new IncrementalStore(mockResource, mockReplicaStore, {
          sourcePublisher: mockSourcePublisher,
          sourceSubscriber: mockSourceSubscriber,
        })

        store.sourceSubscriber = undefined

        expect(store["_sourceSubscriber"]).toBeUndefined()
      })
    })
  })

  describe("get [sourceSubscriber]", () => {
    it("returns the IncrementalStore's _sourceSubscriber", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockSourcePublisher = makeMockPublisherWithEvents()
      const mockSourceSubscriber = makeMockSubscriber()
      const store = new IncrementalStore(mockResource, mockReplicaStore, {
        sourcePublisher: mockSourcePublisher,
        sourceSubscriber: mockSourceSubscriber,
      })

      expect(store.sourceSubscriber).toBe(store["_sourceSubscriber"])
    })
  })

  describe("[create]", () => {
    it("forwards calls to the CreateAction", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockInputEntity = makeMockEntity({
        resource: mockResource,
      })
      const mockOutputEntity = makeMockEntity({
        resource: mockResource,
      })

      const actionSpy = jest
        .spyOn(CreateAction.prototype, "create")
        .mockResolvedValue(mockOutputEntity)
      const store = new IncrementalStore(mockResource, mockReplicaStore)

      const response = store.create(mockInputEntity, true)
      expect(actionSpy).toHaveBeenCalledWith(mockInputEntity, true)
      expect(response).resolves.toBe(mockOutputEntity)
    })
  })

  describe("[read]", () => {
    it("forwards calls to the ReadAction", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockInputQuery = makeMockQuery({
        resource: mockResource,
      })

      const mockOutputEntity = makeMockEntity({
        resource: mockResource,
      })
      const actionSpy = jest
        .spyOn(ReadAction.prototype, "read")
        .mockResolvedValue([mockOutputEntity])
      const store = new IncrementalStore(mockResource, mockReplicaStore)

      const response = store.read(mockInputQuery, true)
      expect(actionSpy).toHaveBeenCalledWith(mockInputQuery, true)
      expect(response).resolves.toEqual([mockOutputEntity])
    })
  })

  describe("[update]", () => {
    it("forwards calls to the UpdateAction", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockInputQuery = makeMockQuery({
        resource: mockResource,
      })
      const mockData = {}

      const mockOutputEntity = makeMockEntity({
        resource: mockResource,
      })
      const actionSpy = jest
        .spyOn(UpdateAction.prototype, "update")
        .mockResolvedValue([mockOutputEntity])
      const store = new IncrementalStore(mockResource, mockReplicaStore)

      const response = store.update(mockInputQuery, mockData)
      expect(actionSpy).toHaveBeenCalledWith(mockInputQuery, mockData)
      expect(response).resolves.toEqual([mockOutputEntity])
    })
  })

  describe("[patch]", () => {
    it("forwards calls to the PatchAction", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockInputQuery = makeMockQuery({
        resource: mockResource,
      })
      const mockPatch = {}
      const mockOutputEntity = makeMockEntity({
        resource: mockResource,
      })

      const actionSpy = jest
        .spyOn(PatchAction.prototype, "patch")
        .mockResolvedValue([mockOutputEntity])
      const store = new IncrementalStore(mockResource, mockReplicaStore)

      const response = store.patch(mockInputQuery, mockPatch)
      expect(actionSpy).toHaveBeenCalledWith(mockInputQuery, mockPatch)
      expect(response).resolves.toEqual([mockOutputEntity])
    })
  })

  describe("[delete]", () => {
    it("forwards calls to the DeleteAction", () => {
      const mockResource = makeMockResource()
      const mockReplicaStore = makeMockPublisherWithEvents()
      const mockInputQuery = makeMockQuery({
        resource: mockResource,
      })
      const mockOutputEntity = makeMockEntity({
        resource: mockResource,
      })

      const actionSpy = jest
        .spyOn(DeleteAction.prototype, "delete")
        .mockResolvedValue([mockOutputEntity])
      const store = new IncrementalStore(mockResource, mockReplicaStore)

      const response = store.delete(mockInputQuery)
      expect(actionSpy).toHaveBeenCalledWith(mockInputQuery)
      expect(response).resolves.toEqual([mockOutputEntity])
    })
  })
})
