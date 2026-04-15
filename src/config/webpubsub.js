const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const webPubSubClient = new WebPubSubServiceClient(
  process.env.WEBPUBSUB_CONNECTION_STRING,
  process.env.WEBPUBSUB_HUB_NAME
);

module.exports = webPubSubClient;