import { EventEmitter } from "node:events"
import type { Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import type { PublisherActionEventInterface } from "../../../src/store/events"

export const makeMockPublisher = <R extends Resource>(
  partial?: Partial<PublisherActionInterface<R>>,
): PublisherActionInterface<R> => ({
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  ...partial,
})

export const makeMockPublisherWithEvents = <R extends Resource>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  partial?: Partial<PublisherActionEventInterface<R>>,
): PublisherActionEventInterface<R> => {
  let publisher = makeMockPublisher()

  publisher = Object.getOwnPropertyNames(EventEmitter.prototype).reduce(
    (_publisher, property) => {
      return { ..._publisher, [property]: jest.fn() }
    },
    publisher,
  )

  return publisher as PublisherActionEventInterface<R>
}
