import type { Resource } from "milliejs"

type PetResourceData = {
  name: string
}
export type PetResource = Resource<PetResourceData>

export default <PetResource>{
  id: "pet",
}
