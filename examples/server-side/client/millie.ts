import MillieJS from "milliejs"
import MillieFileSystemStore from "@milliejs/store-filesystem"
import MillieGooglePubSubStore, {
  MessageParser,
} from "@milliejs/store-google-pubsub"

import personResource, { PersonResource } from "./resources/person"
import petResource, { PetResource } from "./resources/pet"

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

const sharedMessageProcessor: MessageParser<PersonResource | PetResource> = (
  message,
) => {
  const event = JSON.parse(message.data.toString())
  const { id, ...entityData } = event.resource

  return {
    eventName: "millie:save",
    entity: {
      id: id,
      resource: {
        id: event.type,
      },
      data: entityData,
      indices: message.attributes,
    },
  }
}

const personUpstreamEventStore = new MillieGooglePubSubStore<PersonResource>(
  {
    projectId: process.env.PUBSUB_PROJECT_ID,
  },
  ["person-subscription"],
  sharedMessageProcessor,
)
millie.registerResource(personResource, sharedReplicaStore, {
  sourceSubscriber: personUpstreamEventStore,
})

const petUpstreamEventStore = new MillieGooglePubSubStore<PetResource>(
  {
    projectId: process.env.PUBSUB_PROJECT_ID,
  },
  ["pet-subscription"],
  sharedMessageProcessor,
)
millie.registerResource(petResource, sharedReplicaStore, {
  sourceSubscriber: petUpstreamEventStore,
})

export default millie
