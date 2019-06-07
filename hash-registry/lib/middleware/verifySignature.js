const jwt = require('jsonwebtoken')
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
  let client
  try {
    const { body: { endpoint: jwksUri } = {} } = await got(
      `${process.env.CA_URL}/endpoints/${iss}`,
      {
        json: true
      }
    )
    client = getClient(jwksUri)
  } catch (error) {
    if (error.statusCode === 404) {
      throw Error('Public key endpoint not found')
    }
    throw Error('Could not get public key', error)
  }

  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        return reject(err)
      }
      resolve(key.publicKey || key.rsaPublicKey)
    })
  })
}

async function verifySignature(req, _, next) {
  let key
  const { token } = req.body
  const {
    header: { kid },
    payload: { iss }
  } = jwt.decode(token, {
    complete: true
  })

  key = await retrieveKey(kid, iss)
  const { hash } = jwt.verify(token, key, {
    algorithms: ['RS256', 'RS512']
  })
  req.hash = hash
  req.organizationId = iss
  next()
}

module.exports = verifySignature
