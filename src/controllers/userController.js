const { profilesContainer } = require("../config/cosmos");

exports.saveProfile = async (req, res) => {
  try {
    const { displayName, bio, profileImageUrl } = req.body;

    const profile = {
      id: `profile-${req.user.id}`,
      userId: String(req.user.id),
      displayName: displayName || req.user.username,
      bio: bio || "",
      profileImageUrl: profileImageUrl || ""
    };

    const { resource } = await profilesContainer.items.upsert(profile);
    return res.json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const querySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [{ name: "@userId", value: String(userId) }]
    };

    const { resources } = await profilesContainer.items.query(querySpec).fetchAll();

    if (resources.length === 0) {
      return res.json({});
    }

    return res.json(resources[0]);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};