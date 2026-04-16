const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  saveProfile,
  getProfile,
  getAllUsers
} = require("../controllers/userController");

router.get("/", authMiddleware, getAllUsers);
router.post("/profile", authMiddleware, saveProfile);
router.get("/profile/:userId", authMiddleware, getProfile);

module.exports = router;