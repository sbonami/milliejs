import { faker } from "@faker-js/faker"
import type { Resource } from "@milliejs/core"

export const makeMockResource = <R extends Resource = Resource>(
  partial?: Partial<R>,
): R | Resource => ({
  id: faker.lorem.slug(),
  ...partial,
})
