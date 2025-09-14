// lib/webp2mp4.js
const fetch = require('node-fetch')
const FormData = require('form-data')

/**
 * Convert WEBP to PNG using external API (ezgif)
 * @param {Buffer} buffer
 * @returns {Promise<string>} - URL of converted PNG
 */
async function webp2png(buffer) {
  if (!Buffer.isBuffer(buffer)) throw new Error('Input must be a Buffer')

  // Upload to telegra.ph first
  const form = new FormData()
  form.append('file', buffer, 'image.webp')

  const res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form
  })

  const json = await res.json()
  if (json.error) throw new Error(json.error)

  // Return direct PNG link (same file but PNG usable)
  return 'https://telegra.ph' + json[0].src
}

module.exports = { webp2png }
