const app = require("./app");

const PORT = process.env.PORT || 5000;

console.log("Starting server...");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { getConnection } = require("./config/sql");

app.get("/test-sql", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT 1 AS testValue");
    res.json(result.recordset);
  } catch (error) {
    console.error("SQL TEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});