const { getConnection } = require("../config/sql");
const { profilesContainer } = require("../config/cosmos");

exports.getAllUsers = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT Id, Username, Email
      FROM Users
      ORDER BY Username ASC
    `);

    const users = result.recordset.map((user) => ({
      id: String(user.Id),
      username: user.Username,
      email: user.Email
    }));

    return res.json(users);
  } catch (error) {
      console.error("GET ALL USERS ERROR:", error);
      return res.status(500).json({ message: error.message });
   }
};

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
    console.error("SAVE PROFILE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = String(req.params.userId);

    const querySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [{ name: "@userId", value: userId }]
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