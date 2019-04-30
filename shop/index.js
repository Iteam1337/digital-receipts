const express = require('express')
const got = require('got')
const jwt = require('jsonwebtoken')
const { readFileSync } = require('fs')
const { serialize } = require('jwks-provider')
const crypto = require('crypto')
const { createHash } = require('../receipt-hash-generator')
const privateKey = readFileSync(`${__dirname}/keys/private_key.pem`)
const publicKey = readFileSync(`${__dirname}/keys/public_key.pem`, 'utf8')
const port = 9000 // TODO get PORT from config
const HASH_REGISTRY_URL = 'http://localhost:5500' // TODO get HASH REGISTRY URL from config
const ORGANIZATION_ID = '123' // TODO get ORGANIZATION ID from config
const CA_URL = 'http://localhost:5700' // TODO get CA URL from config
const JWKS_URL = 'http://localhost:9000/jwks' // TODO get JWKS URL from config
const app = express()

const kid = crypto
  .createHash('SHA256')
  .update(publicKey)
  .digest('hex')

const keyid = `${JWKS_URL}/${kid}` // TODO move KID creation to a key provider

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/jwks', async (_, res) => {
  const key = {
    publicKey,
    use: 'sig',
    kid: keyid
  } // TODO this should be part of key provider
  res.send(serialize([key]))
})

app.post('/buy', (_, res) => {
  const receipt = {
    organizationId: ORGANIZATION_ID,
    shopName: 'tågresor.se',
    items: ['Stockholm Malmö resa'],
    amount: 411,
    currency: 'SEK',
    vat: 24.66,
    vatPercent: 6,
    date: new Date()
  }
  const hash = createHash(receipt)

  const signedPayload = jwt.sign(
    {
      hash,
      organizationId: ORGANIZATION_ID
    },
    privateKey,
    { algorithm: 'RS256', keyid, issuer: ORGANIZATION_ID }
  )

  got('http://localhost:7900/emails', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hash,
      receipt
    })
  })

  got(`${HASH_REGISTRY_URL}/register-receipt`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'text/plain'
    },
    body: signedPayload
  })

  res.sendStatus(200)
})

app.post('/enrol', async (_, res) => {
  try {
    const { body } = await got(`${CA_URL}/enrol`, {
      method: 'POST',
      json: true,
      body: {
        organizationId: ORGANIZATION_ID,
        endpoint: JWKS_URL
      }
    })
    res.send(body)
  } catch (err) {
    return res.status(err.statusCode).send(err.body)
  }
})

app.listen(port, () => console.log(`Shop app listening on port ${port}!`))
