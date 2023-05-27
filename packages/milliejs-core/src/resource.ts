// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Resource<D = any> = {
  id: string
}

export type ResourceDataType<R extends Resource> = R extends Resource<infer D>
  ? D
  : never
