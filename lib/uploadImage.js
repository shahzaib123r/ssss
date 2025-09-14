// lib/uploadImage.js
const fs = require("fs");
const path = require("path");

async function uploadImage(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found: " + filePath);
    }

    // Normally this would upload image to an API or server
    // But here we just return the local file path
    return { url: path.resolve(filePath) };
  } catch (err) {
    console.error("UploadImage Error:", err.message);
    return null;
  }
}

module.exports = uploadImage;
