import type { Resource } from "./resource"

export type Query = {
  resource: Resource
  cardinality: "one" | "many"
  attributes: Record<string, string | number | boolean>
}

export function isQuery(
  queryOrUnknown: Query | unknown,
): queryOrUnknown is Query {
  return !!(
    typeof (queryOrUnknown as Query).resource !== "undefined" &&
    typeof (queryOrUnknown as Query).cardinality !== "undefined" &&
    typeof (queryOrUnknown as Query).attributes !== "undefined"
  )
}
