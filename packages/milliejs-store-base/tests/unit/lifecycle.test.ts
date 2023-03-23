import {
  StoreLifecycleInterface,
  isStoreLifecycleInterface,
} from "../../src/lifecycle"

const conformingObject: StoreLifecycleInterface = {
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
}

describe("lifecycle", () => {
  describe("isStoreLifecycleInterface", () => {
    describe("when the passed object conforms to the StoreLifecycleInterface", () => {
      it("should return true", () => {
        expect(isStoreLifecycleInterface(conformingObject)).toBe(true)
      })
    })

    describe.each([["connect"], ["disconnect"]])("[%s]", (methodName) => {
      describe(`when the passed object does not have a ${methodName} method`, () => {
        it("should return false", () => {
          const malformedObject = {
            ...conformingObject,
            [methodName]: undefined,
          }
          expect(isStoreLifecycleInterface(malformedObject)).toBe(false)
        })
      })
    })
  })
})
