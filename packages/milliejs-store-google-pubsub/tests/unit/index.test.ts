import GooglePubSubStore from "../../src"

describe("@millie/store-google-pubsub", () => {
  describe("new GooglePubSubStore()", () => {
    it("returns a new instance of the GooglePubSubStore", () => {
      const store = new GooglePubSubStore({})
      expect(store).toBeInstanceOf(GooglePubSubStore)
    })
  })

  describe("#connect()", () => {
    it("resolves immediately", () => {
      const store = new GooglePubSubStore({})

      return expect(store.connect()).resolves.toBeUndefined()
    })
  })

  describe("#disconnect()", () => {
    it("resolves immediately", () => {
      const store = new GooglePubSubStore({})

      return expect(store.disconnect()).resolves.toBeUndefined()
    })
  })
})
