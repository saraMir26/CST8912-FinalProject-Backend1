const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection, sql } = require("../config/sql");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pool = await getConnection();

    const existing = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE Email = @email");

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.request()
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("passwordHash", sql.NVarChar, passwordHash)
      .query(`
        INSERT INTO Users (Username, Email, PasswordHash)
        VALUES (@username, @email, @passwordHash)
      `);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await getConnection();

    const result = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE Email = @email");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.recordset[0];

    const validPassword = await bcrypt.compare(password, user.PasswordHash);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.Id,
        username: user.Username,
        email: user.Email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.Id,
        username: user.Username,
        email: user.Email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};