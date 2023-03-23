import type { IncrementalStore } from "../../incremental"

export abstract class ActionBase {
  constructor(protected store: IncrementalStore) {}
}
