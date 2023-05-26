type DoneResponse = Error | string | unknown | undefined
type DoneType = (response?: DoneResponse) => void
type AssertionType = (cb: DoneType) => Promise<any>

export default (assertion: AssertionType, ms = 10) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    let called = false
    let result: any

    const done = (response: DoneResponse) => {
      called = true
      result = response
    }

    try {
      await assertion(done)

      const interval = setInterval(() => {
        if (called) {
          result ? reject(result) : resolve()
          clearInterval(interval)
        }
      }, ms)
    } catch (error) {
      reject(error)
    }
  })
}
