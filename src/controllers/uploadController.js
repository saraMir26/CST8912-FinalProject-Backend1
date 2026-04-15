const { containerClient } = require("../config/blob");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const blobName = `${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype
      }
    });

    return res.json({
      imageUrl: blockBlobClient.url
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};