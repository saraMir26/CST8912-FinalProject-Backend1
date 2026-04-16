const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getMessages,
  sendMessage,
  negotiateWebSocket,
  getUsers
} = require("../controllers/chatController");

router.get("/", authMiddleware, getMessages);
router.post("/", authMiddleware, sendMessage);
router.get("/negotiate", authMiddleware, negotiateWebSocket);
router.get("/users", authMiddleware, getUsers);

module.exports = router;