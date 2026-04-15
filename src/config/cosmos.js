const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const database = client.database(process.env.COSMOS_DATABASE);

const messagesContainer = database.container("messages");
const profilesContainer = database.container("profiles");
const postsContainer = database.container("posts");
const followsContainer = database.container("follows");

module.exports = {
  messagesContainer,
  profilesContainer,
  postsContainer,
  followsContainer
};