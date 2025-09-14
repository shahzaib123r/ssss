// lib/uploadFile.js
const fetch = require('node-fetch')
const FormData = require('form-data')

/**
 * Upload Buffer to telegra.ph
 * @param {Buffer} buffer 
 * @returns {Promise<string>} - Uploaded file URL
 */
async function uploadFile(buffer) {
  if (!Buffer.isBuffer(buffer)) throw new Error('Input must be a Buffer')

  const form = new FormData()
  form.append('file', buffer, 'file.jpg')

  const res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form
  })

  const json = await res.json()
  if (json.error) throw new Error(json.error)

  return 'https://telegra.ph' + json[0].src
}

module.exports = uploadFile
