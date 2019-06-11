const jwt = require('jsonwebtoken')
const { generateKeyPair } = require('crypto')
const { promisify } = require('util')
const { pem2jwk } = require('pem-jwk')
const nock = require('nock')
process.env.CA_URL = 'http://localhost:5700'
const verifySignature = require('../verifySignature')

const generateKeys = async (use, kid) => {
  const { publicKey, privateKey } = await promisify(generateKeyPair)('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
  })
  return { publicKey, privateKey, use, kid }
}

describe('verify signature middleware', () => {
  let req,
    res,
    next,
    publicKey,
    privateKey,
    organizationId,
    kid,
    retrieveEndpointRequest,
    retrieveKeyRequest,
    hash
  beforeEach(async () => {
    kid = 'key1'
    organizationId = '456'
    hash = '3216876sa='

    retrieveEndpointRequest = nock('http://localhost:5700')
      .get('/endpoints/456')
      .reply(200, {
        endpoint: 'http://localhost:8900/jwks',
        organizationId
      })
    ;({ publicKey, privateKey } = await generateKeys('sig', kid))
    const jwk = pem2jwk(publicKey, { kid, use: 'sig' })
    retrieveKeyRequest = nock('http://localhost:8900')
      .get('/jwks')
      .reply(200, {
        keys: [jwk]
      })

    const token = jwt.sign(
      {
        hash
      },
      privateKey,
      {
        algorithm: 'RS256',
        keyid: 'key1',
        issuer: organizationId
      }
    )
    req = {
      body: {
        token
      }
    }
    res = {}
    next = jest.fn()
  })

  test(`it retrieves the public key from the endpoint that it
  gets from CA for the iss from the signature`, async () => {
    await verifySignature(req, res, next)
    retrieveEndpointRequest.isDone()
    retrieveKeyRequest.isDone()
  })

  test('it calls the next function when the signature is verified', async () => {
    expect(req.hash).toBeUndefined()
    expect(req.organizationId).toBeUndefined()
    await verifySignature(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.hash).toBe(hash)
    expect(req.organizationId).toBe(organizationId)
  })
})
