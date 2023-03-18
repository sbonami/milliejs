export const LifecycleEvents = {
  Delta: "millie:delta",
  Save: "millie:save",
  Delete: "millie:delete",
} as const

export type LifecycleEventsType =
  (typeof LifecycleEvents)[keyof typeof LifecycleEvents]
