import { makeMockEntity, makeMockResource } from "@milliejs/jest-utils"
import { Query, Resource } from "@milliejs/store-base"
import InMemoryStore from "@milliejs/store-memory"
import FileSystemStore from "../../src"

type MockResource = Resource<unknown>

describe("@millie/store-filesystem", () => {
  let store: FileSystemStore<MockResource>
  beforeEach(async () => {
    store = new FileSystemStore({})
    await store.connect()
  })
  afterEach(async () => {
    await store.disconnect()
  })

  describe("new FileSystemStore()", () => {
    it("returns a new instance of the FileSystemStore", () => {
      expect(store).toBeInstanceOf(FileSystemStore)
    })
  })

  describe("#create(entity: Entity)", () => {
    it("defers to the InMemoryStore", () => {
      const entity = makeMockEntity()

      const response = jest.fn()
      const spy = jest
        .spyOn(InMemoryStore.prototype, "create")
        .mockResolvedValue(response as any)

      expect(store.create(entity)).resolves.toBe(response)
      expect(spy).toHaveBeenCalledWith(entity)
    })
  })

  describe("#read(query: Query)", () => {
    const resource = makeMockResource()
    const noMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "0",
        b: "0",
      },
    })
    const partialMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "a",
        b: "0",
      },
    })
    const fullMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "a",
        b: "b",
      },
    })
    const query: Query = {
      resource,
      cardinality: "many",
      attributes: {
        a: "a",
        b: "b",
      },
    }
    beforeEach(async () => {
      await store.create(noMatchEntity)
      await store.create(partialMatchEntity)
      await store.create(fullMatchEntity)
    })

    it("defers to the InMemoryStore", () => {
      const response = jest.fn()
      const spy = jest
        .spyOn(InMemoryStore.prototype, "read")
        .mockResolvedValue(response as any)

      expect(store.read(query)).resolves.toBe(response)
      expect(spy).toHaveBeenCalledWith(query)
    })
  })

  describe("#update(entityOrQuery: Query | Entity, data: Entity['data'])", () => {
    const resource = makeMockResource()
    const noMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "0",
        b: "0",
      },
    })
    const partialMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "a",
        b: "0",
      },
    })
    const fullMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "a",
        b: "b",
      },
    })
    const data = {
      a: "AAA",
      b: "BBB",
    }
    beforeEach(async () => {
      await store.create(noMatchEntity)
      await store.create(partialMatchEntity)
      await store.create(fullMatchEntity)
    })

    describe("when passed an Entity", () => {
      it("defers to the InMemoryStore", () => {
        const response = jest.fn()
        const spy = jest
          .spyOn(InMemoryStore.prototype, "update")
          .mockResolvedValue(response as any)

        expect(store.update(fullMatchEntity, data)).resolves.toBe(response)
        expect(spy).toHaveBeenCalledWith(fullMatchEntity, data)
      })
    })

    describe("when passed a Query", () => {
      const query: Query = {
        resource,
        cardinality: "many",
        attributes: {
          a: "a",
          b: "b",
        },
      }

      it("defers to the InMemoryStore", () => {
        const response = jest.fn()
        const spy = jest
          .spyOn(InMemoryStore.prototype, "update")
          .mockResolvedValue(response as any)

        expect(store.update(query, data)).resolves.toBe(response)
        expect(spy).toHaveBeenCalledWith(query, data)
      })
    })
  })

  describe("#patch(entityOrQuery: Query | Entity, patch: any)", () => {
    const resource = makeMockResource()
    const noMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "0",
        b: "0",
      },
    })
    const partialMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "a",
        b: "0",
      },
    })
    const fullMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "a",
        b: "b",
      },
    })
    const patch = [
      {
        op: "replace",
        path: "/a",
        value: "AAA",
      },
      {
        op: "replace",
        path: "/b",
        value: "BBB",
      },
    ]
    beforeEach(async () => {
      await store.create(noMatchEntity)
      await store.create(partialMatchEntity)
      await store.create(fullMatchEntity)
    })

    describe("when passed an Entity", () => {
      it("defers to the InMemoryStore", () => {
        const response = jest.fn()
        const spy = jest
          .spyOn(InMemoryStore.prototype, "patch")
          .mockResolvedValue(response as any)

        expect(store.patch(fullMatchEntity, patch)).resolves.toBe(response)
        expect(spy).toHaveBeenCalledWith(fullMatchEntity, patch)
      })
    })

    describe("when passed a Query", () => {
      const query: Query = {
        resource,
        cardinality: "many",
        attributes: {
          a: "a",
          b: "b",
        },
      }

      it("defers to the InMemoryStore", () => {
        const response = jest.fn()
        const spy = jest
          .spyOn(InMemoryStore.prototype, "patch")
          .mockResolvedValue(response as any)

        expect(store.patch(query, patch)).resolves.toBe(response)
        expect(spy).toHaveBeenCalledWith(query, patch)
      })
    })
  })

  describe("#delete(entityOrQuery: Query | Entity)", () => {
    const resource = makeMockResource()
    const noMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "0",
        b: "0",
      },
    })
    const partialMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "a",
        b: "0",
      },
    })
    const fullMatchEntity = makeMockEntity({
      resource,
      data: {
        a: "a",
        b: "b",
      },
    })
    beforeEach(async () => {
      await store.create(noMatchEntity)
      await store.create(partialMatchEntity)
      await store.create(fullMatchEntity)
    })

    describe("when passed an Entity", () => {
      it("defers to the InMemoryStore", () => {
        const response = jest.fn()
        const spy = jest
          .spyOn(InMemoryStore.prototype, "delete")
          .mockResolvedValue(response as any)

        expect(store.delete(fullMatchEntity)).resolves.toBe(response)
        expect(spy).toHaveBeenCalledWith(fullMatchEntity)
      })
    })

    describe("when passed a Query", () => {
      const query: Query = {
        resource,
        cardinality: "many",
        attributes: {
          a: "a",
          b: "b",
        },
      }

      it("defers to the InMemoryStore", () => {
        const response = jest.fn()
        const spy = jest
          .spyOn(InMemoryStore.prototype, "delete")
          .mockResolvedValue(response as any)

        expect(store.delete(query)).resolves.toBe(response)
        expect(spy).toHaveBeenCalledWith(query)
      })
    })
  })
})
