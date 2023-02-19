import type { SubscriberActionInterface } from "@milliejs/store-base"

export const makeMockSubscriber = (
  partial?: Partial<SubscriberActionInterface>,
): SubscriberActionInterface => ({
  addListener: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
  setMaxListeners: jest.fn(),
  getMaxListeners: jest.fn(),
  listenerCount: jest.fn(),
  listeners: jest.fn(),
  rawListeners: jest.fn(),
  prependListener: jest.fn(),
  prependOnceListener: jest.fn(),
  eventNames: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  once: jest.fn(),
  emit: jest.fn(),
  ...partial,
})
