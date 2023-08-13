import MillieJS from "milliejs"
import MillieFileSystemStore from "@milliejs/store-filesystem"

import personResource from "./resources/person"
import petResource from "./resources/pet"

/**
 * Configure Millie to facilitate the synchronization process
 *
 * This configuration includes MillieJS itself.
 **/
const millie = new MillieJS()

const sharedReplicaStore = new MillieFileSystemStore({
  filepath: "./replica.json",
  encoding: "utf8",
})

/**
 * Configure the resources that Millie should synchronize from the upstream store to the replica store
 **/

/**
 * Configure Resources for Synchronization
 *
 * This set of configurations are for the resources that Millie should
 * synchronize from the upstream store to the replica store. Each resource is
 * registered with Millie alongside the appropriate stores. This enables
 * configurations to be shared or unique depending on your use-case.
 **/

millie.registerResource(personResource, sharedReplicaStore)
millie.registerResource(petResource, sharedReplicaStore)

export default millie
