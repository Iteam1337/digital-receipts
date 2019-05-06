const jwksClient = require('jwks-rsa')
const got = require('got')

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
  const {
    body: {
      endpoint: jwksUri
    } = {}
  } = await got(`${process.env.CA_URL}/${iss}`, {
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