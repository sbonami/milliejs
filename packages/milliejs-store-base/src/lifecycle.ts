export interface StoreLifecycleInterface {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

// TODO: typeof check
export function isStoreLifecycleInterface(
  connectionOrUnknown: StoreLifecycleInterface | undefined | unknown,
): connectionOrUnknown is StoreLifecycleInterface {
  return !!(
    typeof connectionOrUnknown !== "undefined" &&
    typeof (connectionOrUnknown as StoreLifecycleInterface).connect !==
      "undefined" &&
    typeof (connectionOrUnknown as StoreLifecycleInterface).disconnect !==
      "undefined"
  )
}
