import { makeMockEntity, makeMockResource } from "@milliejs/jest-utils"
import type { Query } from "@milliejs/store-base"
import InMemoryStore from "../../src"

describe("@millie/store-memory", () => {
  describe("new InMemoryStore()", () => {
    it("returns a new instance of the InMemoryStore", () => {
      const store = new InMemoryStore({})
      expect(store).toBeInstanceOf(InMemoryStore)
    })
  })

  describe("#connect()", () => {
    it("resolves immediately", () => {
      const store = new InMemoryStore({})
      return expect(store.connect()).resolves.toBeUndefined()
    })
  })

  describe("#disconnect()", () => {
    it("resolves immediately", () => {
      const store = new InMemoryStore({})
      return expect(store.disconnect()).resolves.toBeUndefined()
    })
  })

  describe("#create(entity: Entity)", () => {
    it("records the entity in the store", () => {
      const store = new InMemoryStore({})
      const entity = makeMockEntity()
      const query: Query = {
        resource: entity.resource,
        cardinality: "many",
        attributes: entity.data,
      }

      store.create(entity)
      return expect(store.read(query)).resolves.toEqual([entity])
    })

    it("returns a Promise that resolves to the Entity", () => {
      const store = new InMemoryStore({})
      const entity = makeMockEntity()

      return expect(store.create(entity)).resolves.toBe(entity)
    })
  })

  describe("#read(query: Query)", () => {
    let store: InMemoryStore
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
      store = new InMemoryStore({})
      await store.create(noMatchEntity)
      await store.create(partialMatchEntity)
      await store.create(fullMatchEntity)
    })

    describe("when all the attributes match an Entity in the store", () => {
      it("returns a Promise that resolves to the matching Entity", () => {
        return expect(store.read(query)).resolves.toContainEqual(
          fullMatchEntity,
        )
      })
    })

    describe("when not all attributes match an Entity in the store", () => {
      it("returns a Promise that does not resolve to include the partial match", () => {
        return expect(store.read(query)).resolves.not.toContainEqual(
          partialMatchEntity,
        )
      })
    })

    describe("when none of the attributes match an Entity in the store", () => {
      it("returns a Promise that does not resolve to include the partial match", () => {
        return expect(store.read(query)).resolves.not.toContainEqual(
          noMatchEntity,
        )
      })
    })
  })

  describe("#update(entityOrQuery: Query | Entity, data: Entity['data'])", () => {
    let store: InMemoryStore
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
      store = new InMemoryStore({})
      await store.create(noMatchEntity)
      await store.create(partialMatchEntity)
      await store.create(fullMatchEntity)
    })

    describe("when passed an Entity", () => {
      describe("when the Entity exists in the store", () => {
        it("mutates the matching Entity in the store", async () => {
          await store.update(fullMatchEntity, data)
          const updatedEntity = {
            ...fullMatchEntity,
            data,
          }

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: updatedEntity.data,
            }),
          ).resolves.toContainEqual(updatedEntity)
        })

        it("returns a Promise that resolves to the updated Entity", () => {
          return expect(store.update(fullMatchEntity, data)).resolves.toEqual([
            {
              ...fullMatchEntity,
              data,
            },
          ])
        })

        it("does not mutate non-matching Entities in the store", async () => {
          await store.update(fullMatchEntity, data)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: noMatchEntity.data,
            }),
          ).resolves.toContainEqual(noMatchEntity)
        })

        it("does not mutate partially-matching Entities in the store", async () => {
          await store.update(fullMatchEntity, data)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: partialMatchEntity.data,
            }),
          ).resolves.toContainEqual(partialMatchEntity)
        })
      })

      describe("when the Entity does not exist in the store", () => {
        beforeEach(() => {
          store = new InMemoryStore({})
        })

        it("creates the updated Entity in the store", async () => {
          await store.update(fullMatchEntity, data)
          const updatedEntity = {
            ...fullMatchEntity,
            data,
          }

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: updatedEntity.data,
            }),
          ).resolves.toContainEqual(updatedEntity)
        })

        it("returns a Promise that resolves to the newly-created Entity", () => {
          return expect(store.update(fullMatchEntity, data)).resolves.toEqual([
            {
              ...fullMatchEntity,
              data,
            },
          ])
        })
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

      describe("when all the attributes match an Entity in the store", () => {
        it("mutates the matching Entity in the store", async () => {
          await store.update(query, data)
          const updatedEntity = {
            ...fullMatchEntity,
            data,
          }

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: updatedEntity.data,
            }),
          ).resolves.toContainEqual(updatedEntity)
        })

        it("returns a Promise that resolves to the updated Entity", () => {
          return expect(store.update(query, data)).resolves.toEqual([
            {
              ...fullMatchEntity,
              data,
            },
          ])
        })
      })

      describe("when not all attributes match an Entity in the store", () => {
        it("does not mutate partially-matching Entities in the store", async () => {
          await store.update(query, data)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: partialMatchEntity.data,
            }),
          ).resolves.toContainEqual(partialMatchEntity)
        })

        it("returns a Promise that does not resolve to include the partial match", () => {
          return expect(store.update(query, data)).resolves.not.toContainEqual(
            partialMatchEntity,
          )
        })
      })

      describe("when none of the attributes match an Entity in the store", () => {
        it("does not mutate non-matching Entities in the store", async () => {
          await store.update(query, data)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: noMatchEntity.data,
            }),
          ).resolves.toContainEqual(noMatchEntity)
        })

        it("returns a Promise that does not resolve to include the partial match", () => {
          return expect(store.update(query, data)).resolves.not.toContainEqual(
            noMatchEntity,
          )
        })
      })
    })
  })

  describe("#patch(entityOrQuery: Query | Entity, patch: any)", () => {
    let store: InMemoryStore
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
      store = new InMemoryStore({})
      await store.create(noMatchEntity)
      await store.create(partialMatchEntity)
      await store.create(fullMatchEntity)
    })

    describe("when passed an Entity", () => {
      describe("when the Entity exists in the store", () => {
        it("mutates the matching Entity in the store", async () => {
          await store.patch(fullMatchEntity, patch)
          const patchedEntity = {
            ...fullMatchEntity,
            data: {
              a: "AAA",
              b: "BBB",
            },
          }

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: patchedEntity.data,
            }),
          ).resolves.toContainEqual(patchedEntity)
        })

        it("returns a Promise that resolves to the patched Entity", () => {
          return expect(store.patch(fullMatchEntity, patch)).resolves.toEqual([
            {
              ...fullMatchEntity,
              data: {
                a: "AAA",
                b: "BBB",
              },
            },
          ])
        })

        it("does not mutate non-matching Entities in the store", async () => {
          await store.patch(fullMatchEntity, patch)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: noMatchEntity.data,
            }),
          ).resolves.toContainEqual(noMatchEntity)
        })

        it("does not mutate partially-matching Entities in the store", async () => {
          await store.patch(fullMatchEntity, patch)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: partialMatchEntity.data,
            }),
          ).resolves.toContainEqual(partialMatchEntity)
        })
      })

      describe("when the Entity does not exist in the store", () => {
        beforeEach(() => {
          store = new InMemoryStore({})
        })

        it("creates the patched Entity in the store", async () => {
          await store.patch(fullMatchEntity, patch)
          const patchedEntity = {
            ...fullMatchEntity,
            data: {
              a: "AAA",
              b: "BBB",
            },
          }

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: patchedEntity.data,
            }),
          ).resolves.toContainEqual(patchedEntity)
        })

        it("returns a Promise that resolves to the newly-created Entity", () => {
          return expect(store.patch(fullMatchEntity, patch)).resolves.toEqual([
            {
              ...fullMatchEntity,
              data: {
                a: "AAA",
                b: "BBB",
              },
            },
          ])
        })
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

      describe("when all the attributes match an Entity in the store", () => {
        it("mutates the matching Entity in the store", async () => {
          await store.patch(query, patch)
          const patchedEntity = {
            ...fullMatchEntity,
            data: {
              a: "AAA",
              b: "BBB",
            },
          }

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: patchedEntity.data,
            }),
          ).resolves.toContainEqual(patchedEntity)
        })

        it("returns a Promise that resolves to the patched Entity", () => {
          return expect(store.patch(query, patch)).resolves.toEqual([
            {
              ...fullMatchEntity,
              data: {
                a: "AAA",
                b: "BBB",
              },
            },
          ])
        })
      })

      describe("when not all attributes match an Entity in the store", () => {
        it("does not mutate partially-matching Entities in the store", async () => {
          await store.patch(query, patch)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: partialMatchEntity.data,
            }),
          ).resolves.toContainEqual(partialMatchEntity)
        })

        it("returns a Promise that does not resolve to include the partial match", () => {
          return expect(store.patch(query, patch)).resolves.not.toContainEqual(
            partialMatchEntity,
          )
        })
      })

      describe("when none of the attributes match an Entity in the store", () => {
        it("does not mutate non-matching Entities in the store", async () => {
          await store.patch(query, patch)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: noMatchEntity.data,
            }),
          ).resolves.toContainEqual(noMatchEntity)
        })

        it("returns a Promise that does not resolve to include the partial match", () => {
          return expect(store.patch(query, patch)).resolves.not.toContainEqual(
            noMatchEntity,
          )
        })
      })
    })
  })

  describe("#delete(entityOrQuery: Query | Entity)", () => {
    let store: InMemoryStore
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
      store = new InMemoryStore({})
      await store.create(noMatchEntity)
      await store.create(partialMatchEntity)
      await store.create(fullMatchEntity)
    })

    describe("when passed an Entity", () => {
      describe("when the Entity exists in the store", () => {
        it("deletes the matching Entity from the store", async () => {
          await store.delete(fullMatchEntity)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: fullMatchEntity.data,
            }),
          ).resolves.not.toContainEqual(fullMatchEntity)
        })

        it("returns a Promise that resolves to the patched Entity", () => {
          return expect(store.delete(fullMatchEntity)).resolves.toEqual([
            fullMatchEntity,
          ])
        })

        it("does not delete non-matching Entities from the store", async () => {
          await store.delete(fullMatchEntity)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: noMatchEntity.data,
            }),
          ).resolves.toContainEqual(noMatchEntity)
        })

        it("does not delete partially-matching Entities from the store", async () => {
          await store.delete(fullMatchEntity)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: partialMatchEntity.data,
            }),
          ).resolves.toContainEqual(partialMatchEntity)
        })
      })

      describe("when the Entity does not exist in the store", () => {
        beforeEach(() => {
          store = new InMemoryStore({})
        })

        it("returns a Promise that resolves to the passed Entity", () => {
          return expect(store.delete(fullMatchEntity)).resolves.toEqual([
            fullMatchEntity,
          ])
        })
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

      describe("when all the attributes match an Entity in the store", () => {
        it("deletes the matching Entity from the store", async () => {
          await store.delete(query)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: fullMatchEntity.data,
            }),
          ).resolves.not.toContainEqual(fullMatchEntity)
        })

        it("returns a Promise that resolves to the deleted Entity", () => {
          return expect(store.delete(query)).resolves.toEqual([fullMatchEntity])
        })
      })

      describe("when not all attributes match an Entity in the store", () => {
        it("does not delete partially-matching Entities from the store", async () => {
          await store.delete(query)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: partialMatchEntity.data,
            }),
          ).resolves.toContainEqual(partialMatchEntity)
        })

        it("returns a Promise that does not resolve to include the partial match", () => {
          return expect(store.delete(query)).resolves.not.toContainEqual(
            partialMatchEntity,
          )
        })
      })

      describe("when none of the attributes match an Entity in the store", () => {
        it("does not delete non-matching Entities from the store", async () => {
          await store.delete(query)

          return expect(
            store.read({
              resource,
              cardinality: "many",
              attributes: noMatchEntity.data,
            }),
          ).resolves.toContainEqual(noMatchEntity)
        })

        it("returns a Promise that does not resolve to include the partial match", () => {
          return expect(store.delete(query)).resolves.not.toContainEqual(
            noMatchEntity,
          )
        })
      })
    })
  })
})
