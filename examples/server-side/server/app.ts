import client, { publish } from "./publish"

export default (req: any, res: any) => {
  const resource = req.path.match(/^\/([^/]*[^s/]).*$/)[1]
  const topic = client.topic(resource)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...attributes } = res.locals.data

  switch (req.method) {
    case "POST": {
      publish(topic, "created", resource, res.locals.data, attributes)
      break
    }
    case "PUT": {
      publish(topic, "updated", resource, res.locals.data, attributes)
      break
    }

    default:
      break
  }
}
