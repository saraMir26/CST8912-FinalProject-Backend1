const { v4: uuidv4 } = require("uuid");
const { messagesContainer } = require("../config/cosmos");
const webPubSubClient = require("../config/webpubsub");

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.query.userId;

    const querySpec = {
      query: `
        SELECT * FROM c 
        WHERE 
          (c.senderId = @userId AND c.receiverId = @otherUserId)
          OR
          (c.senderId = @otherUserId AND c.receiverId = @userId)
        ORDER BY c.createdAt ASC
      `,
      parameters: [
        { name: "@userId", value: userId },
        { name: "@otherUserId", value: otherUserId }
      ]
    };

    const { resources } = await messagesContainer.items.query(querySpec).fetchAll();

    return res.json(resources);
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text, receiverId } = req.body;
    const senderId = req.user.id;

    const message = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      senderName: req.user.username,
      text,
      createdAt: new Date().toISOString()
    };

    await messagesContainer.items.create(message);

    return res.json(message);
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.negotiateWebSocket = async (req, res) => {
  try {
    const token = await webPubSubClient.getClientAccessToken();
    console.log("Web PubSub negotiate token:", token);

    return res.json({ url: token.url });
  } catch (error) {
    console.error("NEGOTIATE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const querySpec = {
      query: "SELECT c.id, c.username FROM c"
    };

    const { resources } = await usersContainer.items.query(querySpec).fetchAll();

    return res.json(resources);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};