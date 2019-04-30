const jwksClient = require('jwks-rsa')

function retrieveKey(kid) {
  const jwksUri = kid.substring(0, kid.lastIndexOf('/'))
  const client = jwksClient({
    strictSsl: false,
    jwksUri
  })
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        return reject(err)
      }
      resolve(key.publicKey || key.rsaPublicKey)
    })
  })
}

module.exports = retrieveKey
