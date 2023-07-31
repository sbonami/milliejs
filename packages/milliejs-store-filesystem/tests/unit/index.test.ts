import { Resource } from "@milliejs/store-base"
import FileSystemStore from "../../src"

type MockResource = Resource<unknown>

describe("@millie/store-filesystem", () => {
  let store: FileSystemStore<MockResource>
  beforeEach(async () => {
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
})
