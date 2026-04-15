const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const postRoutes = require("./routes/postRoutes");
const followRoutes = require("./routes/followRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/upload", uploadRoutes);

module.exports = app;