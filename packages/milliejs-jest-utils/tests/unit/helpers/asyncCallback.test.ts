import asyncCallback from "../../../src/helpers/asyncCallback"

describe("asyncCallback", () => {
  describe("when the callback's returned promise resolves", () => {
    describe("when the callback's done argument is called", () => {
      describe("with no value", () => {
        it("resolves", () => {
          return expect(
            asyncCallback((done) => {
              setTimeout(() => {
                done()
              }, 100)

              return Promise.resolve()
            }),
          ).resolves.toBeUndefined()
        })
      })

      describe("with a value", () => {
        it("rejects with the value", () => {
          const value = jest.fn()

          return expect(
            asyncCallback((done) => {
              setTimeout(() => {
                done(value)
              }, 100)

              return Promise.resolve()
            }),
          ).rejects.toBe(value)
        })
      })
    })
  })

  describe("when the callback's returned promise rejects", () => {
    it("rejects with the value", () => {
      const value = jest.fn()

      return expect(
        asyncCallback(() => {
          return Promise.reject(value)
        }),
      ).rejects.toBe(value)
    })
  })
})
