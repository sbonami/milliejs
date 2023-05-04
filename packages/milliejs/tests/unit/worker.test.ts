import type { StoreLifecycleInterface } from "@milliejs/store-base"
import { Worker } from "../../src/worker"
import EventEmitter from "events"

class MockStoreConnection implements StoreLifecycleInterface {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async connect() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async disconnect() {}
}

class MockWorkerSubclass extends Worker {
  mockConnections: Array<StoreLifecycleInterface> = []

  constructor() {
    super()
  }

  protected get connections(): Array<StoreLifecycleInterface> {
    return this.mockConnections
  }
}

describe("Worker", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it("should initialize with new state", () => {
    const worker = new MockWorkerSubclass()
    expect(worker.state).toBe("new")
  })

  it("should set state to running after init", async () => {
    const worker = new MockWorkerSubclass()
    const mockConnection = new MockStoreConnection()

    worker.mockConnections.push(mockConnection)

    await worker["init"]()
    expect(worker.state).toBe("running")
  })

  it("should set state to exiting after close", async () => {
    const worker = new MockWorkerSubclass()
    const mockConnection = new MockStoreConnection()

    worker.mockConnections.push(mockConnection)

    await worker["init"]()
    worker.close()
    expect(worker.state).toBe("exiting")
  })

  it("should set state to terminated after close", async () => {
    const worker = new MockWorkerSubclass()
    const mockConnection = new MockStoreConnection()

    worker.mockConnections.push(mockConnection)

    await worker["init"]()
    await worker.close()
    expect(worker.state).toBe("terminated")
  })

  it("should call the disconnect method for each connection when closing", async () => {
    const worker = new MockWorkerSubclass()
    const mockConnection = new MockStoreConnection()

    const spy = jest.spyOn(mockConnection, "disconnect")
    worker.mockConnections.push(mockConnection)

    await worker.close()
    expect(spy).toHaveBeenCalled()
  })

  it("should set loop interval when listen is called", () => {
    const worker = new MockWorkerSubclass()
    const spy = jest.spyOn(global, "setInterval")
    const mockConnection = new MockStoreConnection()

    worker.mockConnections.push(mockConnection)

    worker.listen()
    expect(spy).toHaveBeenCalled()
    clearInterval(worker["loop"])
  })

  it("should call init on first loop iteration", async () => {
    const worker = new MockWorkerSubclass()
    const mockConnection = new MockStoreConnection()

    worker.mockConnections.push(mockConnection)
    const spy = jest.spyOn(worker as any, "init")

    await worker["listen"]()

    jest.advanceTimersByTime(1000)
    expect(spy).toHaveBeenCalled()
  })

  it("should call callback after init on first loop iteration", (done) => {
    expect.assertions(1)

    const worker = new MockWorkerSubclass()
    const mockConnection = new MockStoreConnection()

    worker.mockConnections.push(mockConnection)
    const mockCallback = () => {
      expect(this).toBe(this)
      done()
    }

    worker["listen"](mockCallback)
    jest.advanceTimersByTime(1000)
  })

  describe("if the callback throws an error", () => {
    it("should close", async () => {
      expect.assertions(1)

      const worker = new MockWorkerSubclass()
      const mockConnection = new MockStoreConnection()
      jest.spyOn(worker as any, "init").mockImplementation(() => {
        throw new Error("Mock Error")
      })

      worker.mockConnections.push(mockConnection)
      const spy = jest.spyOn(worker as any, "close")

      await worker["listen"]()

      jest.advanceTimersByTime(1000)
      expect(spy).toHaveBeenCalled()
    })

    it("should log the error", async () => {
      expect.assertions(1)

      const error = new Error("Mock Error")
      const worker = new MockWorkerSubclass()
      const mockConnection = new MockStoreConnection()
      jest.spyOn(worker as any, "init").mockImplementation(() => {
        throw error
      })

      worker.mockConnections.push(mockConnection)
      const spy = jest.spyOn(console, "error")

      await worker["listen"]()

      jest.advanceTimersByTime(1000)
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ error }))
    })
  })

  describe.each(["SIGTERM", "exit"])(
    "if the process recieves a %s",
    (signal) => {
      const mockExit = jest.fn()
      beforeEach(() => {
        jest.spyOn(process, "exit").mockImplementationOnce(mockExit as any)
      })

      it("should debug with the exit code", async () => {
        expect.assertions(1)

        const mockProcess = new EventEmitter()
        jest.spyOn(process, "on").mockImplementation((eventName, listener) => {
          mockProcess.on(eventName, listener)
          return process
        })

        const worker = new MockWorkerSubclass()
        const mockConnection = new MockStoreConnection()
        worker.mockConnections.push(mockConnection)

        const spy = jest.spyOn(console, "debug")

        await worker["listen"]()

        mockProcess.emit(signal, 0)
        jest.advanceTimersByTime(1000)
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("SIGTERM"))
      })

      it("should close the worker", async () => {
        expect.assertions(1)

        const mockProcess = new EventEmitter()
        jest.spyOn(process, "on").mockImplementation((eventName, listener) => {
          mockProcess.on(eventName, listener)
          return process
        })

        const worker = new MockWorkerSubclass()
        const mockConnection = new MockStoreConnection()
        worker.mockConnections.push(mockConnection)

        const spy = jest.spyOn(worker, "close")

        await worker["listen"]()

        mockProcess.emit(signal, 0)
        jest.advanceTimersByTime(1000)
        expect(spy).toHaveBeenCalled()
      })
    },
  )
})
