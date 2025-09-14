const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function tmp(file) {
  return path.join(__dirname, '../tmp', file);
}

async function sticker(img, url, packname = 'MyBot', author = 'Bot') {
  return new Promise((resolve, reject) => {
    try {
      let filename = tmp(Date.now() + '.webp');
      let args = [
        '-y',
        '-i', img ? 'pipe:0' : url,
        '-vf',
        `scale=512:512:force_original_aspect_ratio=decrease,fps=15, pad=512:512:-1:-1:color=white@0.0, setsar=1`,
        '-vsync', '0',
        '-s', '512x512',
        '-f', 'webp',
        filename
      ];

      let ff = spawn('ffmpeg', args);
      if (img) ff.stdin.write(img);
      ff.stdin.end();

      ff.on('close', () => {
        if (fs.existsSync(filename)) {
          resolve(fs.readFileSync(filename));
          fs.unlinkSync(filename);
        } else {
          reject(new Error('Failed to create sticker'));
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = { sticker };
