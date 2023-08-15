const MillieJS = require("milliejs").default
const MillieFileSystemStore = require("@milliejs/store-filesystem").default
const MillieMemoryStore = require("@milliejs/store-memory").default

/**
 * Configure Millie to facilitate the synchronization process
 *
 * This configuration includes MillieJS itself, as well as the upstream and
 * replica stores. The upstream source is generally referred to as the
 * "source of truth", whereas the replica is sometimes called a copy or cache.
 **/
const millie = new MillieJS()

const upstreamStore = new MillieFileSystemStore({
  filepath: "./upstream.json",
  encoding: "utf8",
})

const sharedReplicaStore = new MillieMemoryStore({})

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

const personResource = {
  id: "person",
}
millie.registerResource(personResource, sharedReplicaStore, {
  sourcePublisher: upstreamStore,
})

module.exports = { millie, personResource }
