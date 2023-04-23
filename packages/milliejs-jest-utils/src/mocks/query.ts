import type { Query } from "@milliejs/core"
import { makeMockResource } from "./resource"

export const makeMockQuery = (partial?: Partial<Query>): Query => ({
  resource: makeMockResource(),
  cardinality: "one",
  attributes: {},
  ...partial,
})
