#!/usr/bin/env node

import { PubSub } from "@google-cloud/pubsub"

if (process.argv.length === 2) {
  console.error("Expected at least one topic argument!")
  process.exit(1)
}

const TOPIC_NAME = process.argv[2]
const SUBSCRIPTION_NAME = process.argv[3] || `${TOPIC_NAME}-subscription`
const PROJECT_ID =
  process.env.PUBSUB_PROJECT_ID || "milliejs-server-side-example"

const client = new PubSub({
  projectId: PROJECT_ID,
})

let topic
try {
  ;[topic] = client.createTopic(TOPIC_NAME)
} catch (error) {
  topic = client.topic(TOPIC_NAME)
}
console.log({ topic })

let subscription
try {
  ;[subscription] = topic.createSubscription(SUBSCRIPTION_NAME)
} catch (error) {
  subscription = client.subscription(SUBSCRIPTION_NAME)
}
console.log({ subscription })
