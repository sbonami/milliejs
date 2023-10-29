# MillieJS: Kafka Store

## Getting Started

### Installation

```
npm add milliejs @milliejs/store-kafka
```

### Usage

```js
import MillieJS from "milliejs"
import MillieCRUDStore from "@milliejs/store-*"
import KafkaStore from "@milliejs/store-kafka"
import MillieMemoryStore from "@milliejs/store-*"

const millie = new MillieJS()

const replicaStore = new MillieMemoryStore({})

const muUpstreamCRUDInterface = new MillieCRUDStore({})
const myUpstreamKafkaInterface = new KafkaStore()

const personResource = { id: "person" }
millie.registerResource(personResource, replicaStore, {
  sourcePublisher: muUpstreamCRUDInterface,
  sourceSubscriber: myUpstreamKafkaInterface,
})
```

#### Configuration

##### Kafka Client

The first argument of the Kafka Store follows the shape of the KafkaJS SDK's
client configuration. More information can be found in the
[KafkaJS documentation](https://kafka.js.org/docs/configuration).

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
