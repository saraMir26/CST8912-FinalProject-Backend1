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
    const { resource } = await profilesContainer.item(`profile-${userId}`, `profile-${userId}`).read();
    return res.json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};