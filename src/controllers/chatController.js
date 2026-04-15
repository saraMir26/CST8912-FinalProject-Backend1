const { v4: uuidv4 } = require("uuid");
const { messagesContainer } = require("../config/cosmos");
const webPubSubClient = require("../config/webpubsub");

exports.getMessages = async (req, res) => {
  try {
    const querySpec = {
      query: "SELECT * FROM c ORDER BY c.createdAt ASC"
    };

    const { resources } = await messagesContainer.items.query(querySpec).fetchAll();
    return res.json(resources);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text, chatRoom = "general" } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const message = {
      id: uuidv4(),
      type: "message",
      senderId: String(req.user.id),
      senderName: req.user.username,
      text,
      chatRoom,
      createdAt: new Date().toISOString()
    };

    const { resource } = await messagesContainer.items.create(message);

    await webPubSubClient.sendToAll({
      type: "message",
      data: JSON.stringify(resource)
    }, "jsonwebpubsub");

    return res.status(201).json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.negotiateWebSocket = async (req, res) => {
  try {
    const token = await webPubSubClient.getClientAccessToken();
    return res.json({ url: token.url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};