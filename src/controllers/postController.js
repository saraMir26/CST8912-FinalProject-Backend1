const { v4: uuidv4 } = require("uuid");
const { postsContainer } = require("../config/cosmos");

exports.createPost = async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;

    const post = {
      id: uuidv4(),
      userId: String(req.user.id),
      username: req.user.username,
      caption: caption || "",
      imageUrl: imageUrl || "",
      createdAt: new Date().toISOString()
    };

    const { resource } = await postsContainer.items.create(post);
    return res.status(201).json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const querySpec = {
      query: "SELECT * FROM c ORDER BY c.createdAt DESC"
    };

    const { resources } = await postsContainer.items.query(querySpec).fetchAll();
    return res.json(resources);
  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};