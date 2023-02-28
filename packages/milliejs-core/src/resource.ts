export type Resource<D = any> = {
  id: string
}

export type ResourceDataType<R extends Resource> = R extends Resource<infer D>
  ? D
  : never
