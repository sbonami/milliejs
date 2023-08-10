const { millie, personResource } = require("./millie")
const { simulatedPause } = require("./utils")

const fetchAllPeople = async () => {
  const people = await millie.read(personResource, {
    resource: personResource,
    cardinality: "many",
    attributes: {},
  })

  console.log({ people })
}

module.exports = async () => {
  // Setup application callbacks to respond to synchronization events
  millie.on(personResource, "millie:save", fetchAllPeople)
  millie.on(personResource, "millie:delete", fetchAllPeople)

  await simulatedPause()

  // Simulate a series of application actions that would normally by triggered
  // from an application interface (e.g. an http request or PubSub message).
  // Note the changes upstream and in the replica every few seconds

  // Create a new person entity
  await millie.create(personResource, {
    name: "Jane Doe",
  })

  await simulatedPause()

  // Get an existing person entity based on known attributes
  await millie.create(personResource, {
    name: "John Doe",
  })
  await millie.read(personResource, {
    resource: personResource,
    cardinality: "one",
    attributes: {
      name: "John Doe",
    },
  })

  await simulatedPause()

  // Update that same entity with a new name
  await millie.update(
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

  await simulatedPause()

  // Patch the entity
  await millie.patch(
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
}
