import type { Resource } from "@milliejs/core"

export type StoreConstructorSourceOptions<R extends Resource> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourcePublisher?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceSubscriber?: any
}

export class IncrementalStore<R extends Resource> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly replicaStore: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sourcePublisher?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sourceSubscriber?: any

  constructor(
    readonly resource: R,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replicaStore: any,
    sourceInterfaces?: StoreConstructorSourceOptions<R>,
  ) {
    this.replicaStore = replicaStore

    if (sourceInterfaces?.sourcePublisher)
      this.sourcePublisher = sourceInterfaces.sourcePublisher

    if (sourceInterfaces?.sourceSubscriber)
      this.sourceSubscriber = sourceInterfaces.sourceSubscriber
  }
}

export default IncrementalStore
