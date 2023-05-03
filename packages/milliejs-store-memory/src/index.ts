import EventEmitter from "node:events"
import {
  Entity,
  isEntity,
  PublisherActionInterface,
  Query,
  Resource,
} from "@milliejs/store-base"
import * as jsonpatch from "fast-json-patch"

type StoreSlice<R extends Resource = Resource<any>> = Map<
  Entity<R>["id"],
  Entity<R>
>
type InMemoryResourceStore<R extends Resource = Resource<any>> = Map<
  R["id"],
  StoreSlice
>

const patchEntity = <R extends Resource = Resource<any>>(
  entity: Entity<R>,
  patch: Array<jsonpatch.Operation>,
): Entity<R> => ({
  ...entity,
  data: jsonpatch.applyPatch(entity.data, patch, true, false).newDocument,
})

class InMemoryStore<R extends Resource = Resource<any>>
  extends EventEmitter
  implements PublisherActionInterface<R>
{
  store: InMemoryResourceStore<R>

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(clientOptions: object) {
    super()

    this.store = new Map()
  }

  async connect() {
    return Promise.resolve()
  }

  async disconnect() {
    return Promise.resolve()
  }

  async create(entity: Entity<R>) {
    this.storeForResource(entity.resource).set(entity.id, entity)
    return entity
  }

  async read(query: Query): Promise<Array<Entity<R>>> {
    const slice = this.storeForResource(query.resource)

    return Array.from(slice.values()).filter((entity) => {
      return Object.entries(query.attributes).every(([key, value]) => {
        return entity.data[key] === value
      })
    })
  }

  async update(entityOrQuery: Query | Entity<R>, data: Entity<R>["data"]) {
    const slice = this.storeForResource(entityOrQuery.resource)

    if (isEntity(entityOrQuery)) {
      const updatedEntity = { ...entityOrQuery, data }
      slice.set(entityOrQuery.id, updatedEntity)
      return [updatedEntity]
    } else {
      const entities = await this.read(entityOrQuery)
      const updatedEntities = entities.map((entity) => ({ ...entity, data }))
      updatedEntities.forEach((updatedEntity) => {
        return this.storeForResource(entityOrQuery.resource).set(
          updatedEntity.id,
          updatedEntity,
        )
      })
      return updatedEntities
    }
  }

  async patch(entityOrQuery: Query | Entity<R>, patch: any) {
    const slice = this.storeForResource(entityOrQuery.resource)

    if (isEntity(entityOrQuery)) {
      const patchedEntity = patchEntity(entityOrQuery, patch)
      slice.set(entityOrQuery.id, patchedEntity)
      return [patchedEntity]
    } else {
      const entities = await this.read(entityOrQuery)
      const patchedEntities = entities.map((entity) =>
        patchEntity(entity, patch),
      )
      patchedEntities.forEach((patchedEntity) => {
        return this.storeForResource(entityOrQuery.resource).set(
          patchedEntity.id,
          patchedEntity,
        )
      })
      return patchedEntities
    }
  }

  async delete(entityOrQuery: Query | Entity<R>) {
    const slice = this.storeForResource(entityOrQuery.resource)

    if (isEntity(entityOrQuery)) {
      slice.delete(entityOrQuery.id)
      return [entityOrQuery]
    } else {
      const matchingEntities = await this.read(entityOrQuery)
      matchingEntities.forEach((matchingEntity) => {
        return this.storeForResource(entityOrQuery.resource).delete(
          matchingEntity.id,
        )
      })
      return matchingEntities
    }
  }

  private storeForResource(
    resource: Resource,
  ): Map<Entity<R>["id"], Entity<R>> {
    if (!this.store.has(resource.id)) this.store.set(resource.id, new Map())

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.store.get(resource.id)!
  }
}

export default InMemoryStore
