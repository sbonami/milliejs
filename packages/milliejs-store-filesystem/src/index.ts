import EventEmitter from "node:events"
import {
  PublisherActionInterface,
  Resource,
} from "@milliejs/store-base"

type ClientOptions = {
}

class FileSystemStore<R extends Resource>
  extends EventEmitter
  implements PublisherActionInterface<R>
{
  constructor(clientOptions: ClientOptions) {
    super()

  }

  async connect() {
  }

  async disconnect() {
  }
}

export default FileSystemStore
