const r = require('./rethinkAdapter')
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

async function retrieveKey(kid) {
  try {
    const { body: { key } = {} } = await got(
      `${process.env.CA_URL}/key/${kid}`,
      {
        json: true
      }
    )
    return key
  } catch (error) {
    if (error.statusCode === 404) {
      throw Error('Public key endpoint not found')
    }
    throw Error('Could not get public key', error)
  }
}

module.exports = retrieveKey
