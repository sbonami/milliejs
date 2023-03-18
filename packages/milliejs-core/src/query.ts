import type { Resource } from "./resource"

export type Query = {
  resource: Resource
  cardinality: "one" | "many"
  attributes: Record<string, any>
}

export function isQuery(queryOrAny: Query | any): queryOrAny is Query {
  return !!(
    typeof (queryOrAny as Query).resource !== "undefined" &&
    typeof (queryOrAny as Query).cardinality !== "undefined" &&
    typeof (queryOrAny as Query).attributes !== "undefined"
  )
}
