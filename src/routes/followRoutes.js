const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { followUser } = require("../controllers/followController");

router.post("/", authMiddleware, followUser);

module.exports = router;