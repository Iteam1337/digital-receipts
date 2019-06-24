const crypto = require('crypto')

function generateHash(payload) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('base64')
}

module.exports = generateHash
