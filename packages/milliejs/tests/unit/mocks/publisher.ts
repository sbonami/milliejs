import type { Resource } from "@milliejs/core"
import type { PublisherActionInterface } from "@milliejs/store-base"
import type { PublisherActionEventInterface } from "../../../src/store/events"
import { makeMockSubscriber } from "./subscriber"

export const makeMockPublisher = <R extends Resource>(
  partial?: Partial<PublisherActionInterface<R>>,
): PublisherActionInterface<R> => ({
  ...partial,
})

export const makeMockPublisherWithEvents = <R extends Resource>(
  partial?: Partial<PublisherActionEventInterface<R>>,
): PublisherActionEventInterface<R> =>
  ({
    ...makeMockSubscriber(),
    ...makeMockPublisher<R>(),
    ...partial,
  } as PublisherActionEventInterface<R>)
