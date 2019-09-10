const crypto = require('crypto')
const { readFileSync } = require('fs')
const privateKey = readFileSync(`${__dirname}/keys/private_key.pem`, 'utf8')
const publicKey = readFileSync(`${__dirname}/keys/public_key.pem`, 'utf8')
const kid = crypto
  .createHash('SHA256')
  .update(publicKey)
  .digest('hex')

const key = {
  publicKey,
  use: 'sig',
  kid
}

module.exports = {
  key,
  kid,
  publicKey,
  privateKey
}
