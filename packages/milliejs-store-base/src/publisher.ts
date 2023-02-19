import type { Resource } from "@milliejs/core"

type MaybeAsync<T> = T | Promise<T>

export interface PublisherActionInterface<R extends Resource> {}

export function isPublisherActionInterface<R extends Resource>(
  interfaceOrAny: PublisherActionInterface<R> | unknown,
): interfaceOrAny is PublisherActionInterface<R> {
  return true
}
