import { PubSub, Topic } from "@google-cloud/pubsub"

const client = new PubSub()

export const publish = (
  topic: Topic,
  action: string,
  type: string,
  resource: string,
  attributes: Record<string, any>,
) => {
  console.log({ action, type, resource, attributes })

  topic.publish(
    Buffer.from(
      JSON.stringify({
        action,
        type,
        resource,
      }),
    ),
    attributes,
  )
}

export default client
