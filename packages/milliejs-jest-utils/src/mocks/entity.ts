import { faker } from "@faker-js/faker"
import type { Entity, Resource } from "@milliejs/core"
import { makeMockResource } from "./resource"

export const makeMockEntity = <R extends Resource = Resource>(
  partial?: Partial<Entity<R>>,
): Entity<R | Resource> => ({
  id: faker.datatype.uuid(),
  resource: makeMockResource(),
  data: {},
  ...partial,
})
