const jwksClient = require('jwks-rsa')
const got = require('got')
const CA_URL = 'http://localhost:5700/endpoints' // TODO get CA_URL from config

const clientCache = {}
function getClient(jwksUri) {
  if (!clientCache[jwksUri]) {
    clientCache[jwksUri] = jwksClient({
      strictSsl: false,
      jwksUri
    })
  }

  return clientCache[jwksUri]
}

async function retrieveKey(kid, iss) {
  const { body: { endpoint: jwksUri } = {} } = await got(`${CA_URL}/${iss}`, {
    json: true
  })

  const client = getClient(jwksUri)

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
