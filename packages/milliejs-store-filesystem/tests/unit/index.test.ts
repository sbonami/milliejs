import fs from "fs"
import fsAsync from "node:fs/promises"
import { makeMockEntity, makeMockResource } from "@milliejs/jest-utils"
import type { Entity, Query, Resource } from "@milliejs/store-base"
import InMemoryStore from "@milliejs/store-memory"
import tempfs from "temp-fs"
import FileSystemStore from "../../src"

type MockResource = Resource<unknown>

describe("@millie/store-filesystem", () => {
  let store: FileSystemStore<MockResource>
  let filepath: string
  beforeEach(async () => {
    filepath = tempfs.name({})
    store = new FileSystemStore({ filepath, encoding: "utf8" })
  })
  afterEach(async () => {
    await store.disconnect()
    fs.rmSync(filepath)
  })
  afterAll(() => {
    tempfs.clearSync()
  })

  describe("new FileSystemStore()", () => {
    it("returns a new instance of the FileSystemStore", () => {
      expect(store).toBeInstanceOf(FileSystemStore)
    })
  })

  describe("#connect()", () => {
    describe("when a file does not yet exist at the provided path ", () => {
      it("creates the file", async () => {
        await store.connect()
        expect(fs.readFileSync(filepath, "utf8")).toMatchInlineSnapshot(`
          "{
            "dataType": "Map",
            "value": []
          }"
        `)
      })
    })

    describe("when a file previously existed at the provided path ", () => {
      let entity: Entity<MockResource>

      beforeEach(async () => {
        entity = makeMockEntity()
        const data = {
          dataType: "Map",
          value: [
            [
              entity.resource.id,
              {
                dataType: "Map",
                value: [
                  [
                    entity.id,
                    {
                      id: entity.id,
                      resource: {
                        id: entity.resource.id,
                      },
                      data: {},
                    },
                  ],
                ],
              },
            ],
          ],
        }

        await fsAsync.writeFile(filepath, JSON.stringify(data), {
          encoding: "utf8",
        })
      })

      it("loads the store with the file's data", async () => {
        await store.connect()
        expect(store["memoryStore"].store).toMatchInlineSnapshot(`
          Map {
            "${entity.resource.id}" => Map {
              "${entity.id}" => {
                "data": {},
                "id": "${entity.id}",
                "resource": {
                  "id": "${entity.resource.id}",
                },
              },
            },
          }
        `)
      })
    })
  })

  describe("#create(entity: Entity)", () => {
    beforeEach(async () => {
      await store.connect()
    })

    it("defers to the InMemoryStore", () => {
      const entity = makeMockEntity()

      const response = jest.fn()
      const spy = jest
        .spyOn(InMemoryStore.prototype, "create")
        .mockResolvedValue(response as any)

      expect(store.create(entity)).resolves.toBe(response)
      expect(spy).toHaveBeenCalledWith(entity)
    })

    it("updates the file-system accordingly", async () => {
      const entity = makeMockEntity()

      await store.create(entity)
      expect(fs.readFileSync(filepath, "utf8")).toMatchInlineSnapshot(`
        "{
          "dataType": "Map",
          "value": [
            [
              "${entity.resource.id}",
              {
                "dataType": "Map",
                "value": [
                  [
                    "${entity.id}",
                    {
                      "id": "${entity.id}",
                      "resource": {
                        "id": "${entity.resource.id}"
                      },
                      "data": {}
                    }
                  ]
                ]
              }
            ]
          ]
        }"
      `)
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
      await store.connect()
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
      await store.connect()
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

      it("updates the file-system accordingly", async () => {
        await store.update(fullMatchEntity, data)
        expect(fs.readFileSync(filepath, "utf8")).toMatchInlineSnapshot(`
          "{
            "dataType": "Map",
            "value": [
              [
                "${fullMatchEntity.resource.id}",
                {
                  "dataType": "Map",
                  "value": [
                    [
                      "${noMatchEntity.id}",
                      {
                        "id": "${noMatchEntity.id}",
                        "resource": {
                          "id": "${noMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "0",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${partialMatchEntity.id}",
                      {
                        "id": "${partialMatchEntity.id}",
                        "resource": {
                          "id": "${partialMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "a",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${fullMatchEntity.id}",
                      {
                        "id": "${fullMatchEntity.id}",
                        "resource": {
                          "id": "${fullMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "AAA",
                          "b": "BBB"
                        }
                      }
                    ]
                  ]
                }
              ]
            ]
          }"
        `)
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

      it("updates the file-system accordingly", async () => {
        await store.update(query, data)
        expect(fs.readFileSync(filepath, "utf8")).toMatchInlineSnapshot(`
          "{
            "dataType": "Map",
            "value": [
              [
                "${query.resource.id}",
                {
                  "dataType": "Map",
                  "value": [
                    [
                      "${noMatchEntity.id}",
                      {
                        "id": "${noMatchEntity.id}",
                        "resource": {
                          "id": "${noMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "0",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${partialMatchEntity.id}",
                      {
                        "id": "${partialMatchEntity.id}",
                        "resource": {
                          "id": "${partialMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "a",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${fullMatchEntity.id}",
                      {
                        "id": "${fullMatchEntity.id}",
                        "resource": {
                          "id": "${fullMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "AAA",
                          "b": "BBB"
                        }
                      }
                    ]
                  ]
                }
              ]
            ]
          }"
        `)
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
      await store.connect()
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

      it("updates the file-system accordingly", async () => {
        await store.patch(fullMatchEntity, patch)
        expect(fs.readFileSync(filepath, "utf8")).toMatchInlineSnapshot(`
          "{
            "dataType": "Map",
            "value": [
              [
                "${fullMatchEntity.resource.id}",
                {
                  "dataType": "Map",
                  "value": [
                    [
                      "${noMatchEntity.id}",
                      {
                        "id": "${noMatchEntity.id}",
                        "resource": {
                          "id": "${noMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "0",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${partialMatchEntity.id}",
                      {
                        "id": "${partialMatchEntity.id}",
                        "resource": {
                          "id": "${partialMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "a",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${fullMatchEntity.id}",
                      {
                        "id": "${fullMatchEntity.id}",
                        "resource": {
                          "id": "${fullMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "AAA",
                          "b": "BBB"
                        }
                      }
                    ]
                  ]
                }
              ]
            ]
          }"
        `)
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

      it("updates the file-system accordingly", async () => {
        await store.patch(query, patch)
        expect(fs.readFileSync(filepath, "utf8")).toMatchInlineSnapshot(`
          "{
            "dataType": "Map",
            "value": [
              [
                "${query.resource.id}",
                {
                  "dataType": "Map",
                  "value": [
                    [
                      "${noMatchEntity.id}",
                      {
                        "id": "${noMatchEntity.id}",
                        "resource": {
                          "id": "${noMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "0",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${partialMatchEntity.id}",
                      {
                        "id": "${partialMatchEntity.id}",
                        "resource": {
                          "id": "${partialMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "a",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${fullMatchEntity.id}",
                      {
                        "id": "${fullMatchEntity.id}",
                        "resource": {
                          "id": "${fullMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "AAA",
                          "b": "BBB"
                        }
                      }
                    ]
                  ]
                }
              ]
            ]
          }"
        `)
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
      await store.connect()
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

      it("updates the file-system accordingly", async () => {
        await store.delete(fullMatchEntity)
        expect(fs.readFileSync(filepath, "utf8")).toMatchInlineSnapshot(`
          "{
            "dataType": "Map",
            "value": [
              [
                "${fullMatchEntity.resource.id}",
                {
                  "dataType": "Map",
                  "value": [
                    [
                      "${noMatchEntity.id}",
                      {
                        "id": "${noMatchEntity.id}",
                        "resource": {
                          "id": "${noMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "0",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${partialMatchEntity.id}",
                      {
                        "id": "${partialMatchEntity.id}",
                        "resource": {
                          "id": "${partialMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "a",
                          "b": "0"
                        }
                      }
                    ]
                  ]
                }
              ]
            ]
          }"
        `)
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

      it("updates the file-system accordingly", async () => {
        await store.delete(query)
        expect(fs.readFileSync(filepath, "utf8")).toMatchInlineSnapshot(`
          "{
            "dataType": "Map",
            "value": [
              [
                "${query.resource.id}",
                {
                  "dataType": "Map",
                  "value": [
                    [
                      "${noMatchEntity.id}",
                      {
                        "id": "${noMatchEntity.id}",
                        "resource": {
                          "id": "${noMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "0",
                          "b": "0"
                        }
                      }
                    ],
                    [
                      "${partialMatchEntity.id}",
                      {
                        "id": "${partialMatchEntity.id}",
                        "resource": {
                          "id": "${partialMatchEntity.resource.id}"
                        },
                        "data": {
                          "a": "a",
                          "b": "0"
                        }
                      }
                    ]
                  ]
                }
              ]
            ]
          }"
        `)
      })
    })
  })
})
