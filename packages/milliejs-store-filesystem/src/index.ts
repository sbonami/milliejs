import EventEmitter from "node:events"
import fs from "node:fs"
import {
  Entity,
  LifecycleEvents,
  PublisherActionInterface,
  Query,
  Resource,
} from "@milliejs/store-base"
import MillieMemoryStore from "@milliejs/store-memory"
import { serialize, deserialize } from "./marshal"

type ClientOptions = {
  filepath: string
  encoding: BufferEncoding
}

class FileSystemStore<R extends Resource>
  extends EventEmitter
  implements PublisherActionInterface<R>
{
  private readonly filepath: ClientOptions["filepath"]
  private readonly encoding: ClientOptions["encoding"] = "utf8"
  private memoryStore = new MillieMemoryStore<R>({})

  constructor(clientOptions: ClientOptions) {
    super()

    this.filepath = clientOptions.filepath
    this.encoding = clientOptions.encoding
  }

  async connect() {
    await this.memoryStore.connect()

    Object.values(LifecycleEvents).forEach((eventName) => {
      this.memoryStore.addListener(eventName, (...args: any[]) => {
        this.emit(eventName, ...args)
      })
    })

    if (fs.existsSync(this.filepath)) {
      this.unmarshal()
    } else {
      this.marshal()
    }
  }

  async disconnect() {
    await this.marshal()
    await this.memoryStore.disconnect()
  }

  async create(entity: Entity<R>) {
    const response = await this.memoryStore.create(entity)
    await this.marshal()
    return response
  }

  async read(query: Query): Promise<Array<Entity<R>>> {
    const response = await this.memoryStore.read(query)
    await this.marshal()
    return response
  }

  async update(entityOrQuery: Query | Entity<R>, data: Entity<R>["data"]) {
    const response = await this.memoryStore.update(entityOrQuery, data)
    await this.marshal()
    return response
  }

  async patch(entityOrQuery: Query | Entity<R>, patch: any) {
    const response = await this.memoryStore.patch(entityOrQuery, patch)
    await this.marshal()
    return response
  }

  async delete(entityOrQuery: Query | Entity<R>) {
    const response = await this.memoryStore.delete(entityOrQuery)
    await this.marshal()
    return response
  }

  private toJSON(): string {
    return JSON.stringify(this.memoryStore.store, serialize, 2)
  }

  private marshal() {
    fs.writeFileSync(this.filepath, this.toJSON(), this.encoding)
  }

  private unmarshal() {
    const data = fs.readFileSync(this.filepath, { encoding: this.encoding })
    this.memoryStore.store = JSON.parse(data, deserialize)
  }
}

export default FileSystemStore
