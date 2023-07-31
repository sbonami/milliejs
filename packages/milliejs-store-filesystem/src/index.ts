import EventEmitter from "node:events"
import {
  Entity,
  PublisherActionInterface,
  Query,
  Resource,
} from "@milliejs/store-base"
import MillieMemoryStore from "@milliejs/store-memory"

type ClientOptions = {
}

class FileSystemStore<R extends Resource>
  extends EventEmitter
  implements PublisherActionInterface<R>
{
  private memoryStore = new MillieMemoryStore<R>({})

  constructor(clientOptions: ClientOptions) {
    super()

  }

  async connect() {
    await this.memoryStore.connect()
  }

  async disconnect() {
    await this.memoryStore.disconnect()
  }

  async create(entity: Entity<R>) {
    const response = await this.memoryStore.create(entity)
    return response
  }

  async read(query: Query): Promise<Array<Entity<R>>> {
    const response = await this.memoryStore.read(query)
    return response
  }

  async update(entityOrQuery: Query | Entity<R>, data: Entity<R>["data"]) {
    const response = await this.memoryStore.update(entityOrQuery, data)
    return response
  }

  async patch(entityOrQuery: Query | Entity<R>, patch: any) {
    const response = await this.memoryStore.patch(entityOrQuery, patch)
    return response
  }

  async delete(entityOrQuery: Query | Entity<R>) {
    const response = await this.memoryStore.delete(entityOrQuery)
    return response
  }
}

export default FileSystemStore
