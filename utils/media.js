const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const mime = require('mime-types');

if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

async function imageToWebpBuffer(inputBuffer) {
  // Use sharp to convert image -> webp (sticker)
  const webp = await sharp(inputBuffer).webp({ quality: 90 }).toBuffer();
  return webp;
}

module.exports = { imageToWebpBuffer };
