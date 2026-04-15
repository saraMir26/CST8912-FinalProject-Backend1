const { v4: uuidv4 } = require("uuid");
const { followsContainer } = require("../config/cosmos");

exports.followUser = async (req, res) => {
  try {
    const { followingId } = req.body;

    if (!followingId) {
      return res.status(400).json({ message: "followingId is required" });
    }

    const follow = {
      id: uuidv4(),
      followerId: String(req.user.id),
      followingId: String(followingId),
      createdAt: new Date().toISOString()
    };

    const { resource } = await followsContainer.items.create(follow);
    return res.status(201).json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};