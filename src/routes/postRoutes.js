const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createPost, getPosts, deletePost } = require("../controllers/postController");

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;