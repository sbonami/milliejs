export interface StoreLifecycleInterface {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

// TODO: typeof check
export function isStoreLifecycleInterface(
  connection: StoreLifecycleInterface | undefined | any,
): connection is StoreLifecycleInterface {
  return !!(
    typeof connection !== "undefined" &&
    typeof (connection as StoreLifecycleInterface).connect !== "undefined" &&
    typeof (connection as StoreLifecycleInterface).disconnect !== "undefined"
  )
}
