<p align="center"><img src="docs/assets/logo-black.png" alt="MillieJS" width="80%"/></p>

MillieJS is a Node.js library written in TypeScript that provides an incremental
store inspired by Apple's iOS NSIncrementalStore. MillieJS is designed to be
flexible and can be extended to work with a variety of interfaces. Whether
you're working on a new application or looking to add incremental storage
capabilities, MillieJS is an excellent choice for a fast, reliable, and
scalable solution.

The name "MillieJS" is a play on the word "millimeter," reflecting the
incremental nature of the library.

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

## Getting Started

Working between your data stores happens with three componenents: a replica store adapter,
a source store crud "push" adapter, and an optional source store subscription "pull" adapter.

```js
import MillieJS from "milliejs"
import MillieCRUDStore from "@milliejs/store-*"
import MillieMemoryStore from "@milliejs/store-*"
import MilliePubSubStore from "@milliejs/store-*"

const millie = new MillieJS()

const replicaStore = new MillieMemoryStore({})
const muUpstreamCRUDInterface = new MillieCRUDStore({})
const myUpstreadSubscriberInterface = new MilliePubSubStore({})

const personResource = { id: "person" }
millie.registerResource(personResource, replicaStore, {
  sourcePublisher: muUpstreamCRUDInterface,
  sourceSubscriber: myUpstreadSubscriberInterface,
})
```

The power of MillieJS lies just beneath the surface of these adapters by taking
care of all the synchronization logic, ensuring your client has the most
up-to-date data available. Millie returns the best-case response from the
source and the optimistic replica store. It ultimately ensures the replica is
consistent with the souce and delivers that latest update to the client.

### CRUD (create/read/update/delete) interface

MillieJS provides a simple interface between your stores with all of the
complex logic working behind the scenes to provide the most up-to-date data.

#### Create

```js
const janeDoe = await millie.create(personResource, {
  name: "Jane Doe",
})
```

[Diagram](docs/actions/create.md)

#### Read

```js
const johnDoe = await millie.read(personResource, {
  resource: personResource,
  cardinality: "one",
  attributes: {
    name: "John Doe",
  },
})
```

[Diagram](docs/actions/read.md)

#### Update

##### Full Payload (PUT)

```js
const jonathanDoe = await millie.update(
  personResource,
  {
    resource: personResource,
    cardinality: "one",
    attributes: {
      name: "John Doe",
    },
  },
  {
    name: "Jonathan Doe",
  },
)
```

[Diagram](docs/actions/update.md)

##### Partial-Payload (PATCH)

```js
const jonDoe = await millie.patch(
  personResource,
  {
    resource: personResource,
    cardinality: "one",
    attributes: {
      name: "Jonathan Doe",
    },
  },
  [
    {
      op: "replace",
      path: "/name",
      value: "Jon Doe",
    },
  ],
)
```

[Diagram](docs/actions/patch.md)

#### Delete

```js
const result = await millie.delete(personResource, {
  resource: personResource,
  cardinality: "one",
  attributes: {
    name: "Jon Doe",
  },
})
```

[Diagram](docs/actions/delete.md)

### Subscription interface

MillieJS provides a simple interface between your stores with all of the
complex logic working behind the scenes to provide the most up-to-date data.

#### Create

```js
const calculateBalance = (entity) => {
  const balance = entity.data.debit - entity.data.credit
  console.log(
    "Account Balance for customer " + entity.data.customer + " is $" + balance,
  )
}

millie.on(bankAccountResource, "millie:delta", calculateBalance)

const bankAccount = await millie.read(bankAccountResource, {
  customer: janeDoe.id,
})
calculateBalance(bankAccount)
```

### Examples

## Contributing

**Note:** Large portions of this README and all other documentation have been
written using ChatGPT.
