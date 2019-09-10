const { generateKeyPair, createHash } = require('crypto')
const { promisify } = require('util')

const generate = async use => {
  const { publicKey, privateKey } = await promisify(generateKeyPair)('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
  })
  return {
    publicKey,
    privateKey,
    use,
    kid: createHash('SHA256')
      .update(publicKey)
      // .digest('base64') // TODO: base64 or hex ? base64 difficult to use in URLs
      .digest('hex')
  }
}

module.exports = async (req, res) => {
  const { total = 2 } = req.query

  const keys = await Promise.all(
    [...Array(parseInt(total, 10))].map(_ => generate('sig'))
  )

  res.send(keys)
}
