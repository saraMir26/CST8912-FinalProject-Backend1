const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authMiddleware, upload.single("image"), uploadImage);

module.exports = router;