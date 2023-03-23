import type { StoreLifecycleInterface } from "@milliejs/store-base"

enum WorkerState {
  new = "new",
  starting = "starting",
  running = "running",
  exiting = "exiting",
  terminated = "terminated",
}

export abstract class Worker {
  private loop?: ReturnType<typeof setInterval>

  constructor(private _state: WorkerState = WorkerState.new) {
    process
      .on("SIGTERM", this.gracefulShutdown("SIGTERM"))
      .on("exit", this.gracefulShutdown("SIGTERM"))
  }

  protected abstract get connections(): Array<StoreLifecycleInterface>

  listen(callback?: () => void): Worker {
    this.loop = setInterval(async () => {
      try {
        if (this.state === WorkerState.new) {
          await this.init()
          if (callback) await callback()
        }
      } catch (error) {
        console.error({ error })
        await this.close()
        clearInterval(this.loop)
      }
    })

    return this
  }

  get state() {
    return this._state
  }

  private async init() {
    console.log("starting")
    this._state = WorkerState.starting

    await Promise.all(
      this.connections.map((connection) => connection.connect()),
    )

    console.log("running")
    this._state = WorkerState.running
  }

  async close(callback?: () => void) {
    console.log("exiting")
    this._state = WorkerState.exiting

    await Promise.all(
      this.connections.map((connection) => connection.disconnect()),
    )

    console.log("terminated")
    this._state = WorkerState.terminated

    if (callback) callback()
  }

  private gracefulShutdown(signal: string, code?: number) {
    return () => {
      console.debug(signal + " signal received: closing server")
      this.close(() => {
        console.debug("server closed")
        process.exit(code || 0)
      })
    }
  }
}

export default Worker
