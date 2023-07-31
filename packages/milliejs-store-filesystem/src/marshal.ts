/* eslint-disable @typescript-eslint/no-explicit-any */
export function serialize(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    }
  } else {
    return value
  }
}

export function deserialize(key: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value)
    }
  }
  return value
}
