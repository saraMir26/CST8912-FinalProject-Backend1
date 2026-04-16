const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { getConnection } = require("./config/sql");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

console.log("app.js loaded");

const allowedOrigins = [
  "http://localhost:5173",
  "https://cst8912-final-chatbox-erh6d2gechfmh0h0.canadacentral-01.azurewebsites.net"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

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

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;