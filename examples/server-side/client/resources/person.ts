import type { Resource } from "milliejs"

type PersonResourceData = {
  name: string
}
export type PersonResource = Resource<PersonResourceData>

export default <PersonResource>{
  id: "person",
}
