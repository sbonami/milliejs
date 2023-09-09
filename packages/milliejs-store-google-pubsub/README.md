# MillieJS: Google PubSub Store

## Getting Started

### Installation

```
npm add milliejs @milliejs/store-google-pubsub
```

### Usage

```js
import MillieJS from "milliejs"
import MillieCRUDStore from "@milliejs/store-*"
import GooglePubSubStore from "@milliejs/store-google-pubsub"
import MillieMemoryStore from "@milliejs/store-*"

const millie = new MillieJS()

const replicaStore = new MillieMemoryStore({})

const muUpstreamCRUDInterface = new MillieCRUDStore({})
const myUpstreadGooglePubSubInterface = new GooglePubSubStore(
  {
    // ... Google PubSub options ...
  },
  ["person-subscription"],
  (message) => {
    const { attributes, data } = message
    const entiry = JSON.parse(data.toString())
    return {
      eventName: "millie:save", // or "millie:delete"
      entity,
    }
  },
)

const personResource = { id: "person" }
millie.registerResource(personResource, replicaStore, {
  sourcePublisher: muUpstreamCRUDInterface,
  sourceSubscriber: myUpstreadSubscriberInterface,
})
```

#### Configuration

##### PubSub Client

The first argument of the GooglePubSub Store follows the shape of the Google
PubSub SDK's PubSub configuration. More information can be found in the
[Google documentation](https://cloud.google.com/nodejs/docs/reference/pubsub/latest/pubsub/pubsub).

##### Subscriptions

The second argument is an array of subscription names the Google PubSub Store
should attach to. These subscriptions should exist prior to the invocation
of the class so that the Google PubSub Store can find it.

##### Message Parser

The third argument is a callback for processing incoming PubSub messages,
providing you the opportunity to integrate with any Google PubSub system.
The message processor is invoked with incoming messages matching the
Google PubSub Message shape. More information can be found in the [Google documentation](https://cloud.google.com/nodejs/docs/reference/pubsub/latest/pubsub/message).

The parser should return an object with two properties: eventName and entity.
The event name should be one of "millie:save" or "millie:delete" depending on
the lifecycle of the underlying entity. The entity itself should follow the
MillieJS Entity shape.

MillieJS takes care to acknowledge the message after parsing and processing
has completed.

#### Subscription interface

MillieJS provides a simple interface between your stores with all of the
complex logic working behind the scenes to provide the most up-to-date data.

```js
millie.on(personResource, "millie:delta", (entity) => {
  console.log("Person updated: " + entity.data.name)
})
```

## Contributing

The MillieJS library is currently in its early development stages and is
welcoming contributions, feature requests, and feedback.

## Disclaimer

The MillieJS library is currently in its early development stages and is not
ready for use in production applications. There may be bugs and performance
issues that have not yet been addressed. Use the library at your own risk and
be sure to thoroughly test any implementation before deploying it to a live
environment.

Please note that the API and functionality may change as the library evolves
and stabilizes. If you choose to use MillieJS in your project, we recommend
regularly checking for updates and making any necessary modifications to your
code to ensure compatibility.

**In summary, do not use the MillieJS library in a production environment until
further notice.**

MillieJS is not affiliated with or endorsed by Google Cloud Platform or its
Google PubSub product. "Google", "Google Cloud", and "Google Cloud Platform"
are registered trademarks of Google LLC. MillieJS provides an adapter to
facilitate integration with Google Cloud Platform's PubSub product using their
SDK, but it is an independent open-source project. The use of these trademarks
is solely for the purpose of identifying the compatibility of MillieJS with the
mentioned services.
