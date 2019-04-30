const express = require('express')
const got = require('got')
const app = express()
const port = 9000
const { createHash } = require('../receipt-hash-generator')
const jwt = require('jsonwebtoken')
const { readFileSync } = require('fs')
const privateKey = readFileSync(`${__dirname}/keys/private_key.pem`)
const publicKey = readFileSync(`${__dirname}/keys/public_key.pem`, 'utf8')
const { serialize } = require('jwks-provider')
const crypto = require('crypto')
const HASH_REGISTRY_URL = 'http://localhost:5500'
const ORGANIZATION_ID = '123'
let keyid
const kid = crypto
  .createHash('SHA256')
  .update(publicKey)
  .digest('hex')
keyid = `http://localhost:9000/jwks/${kid}`

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/jwks', async (_, res) => {
  const key = {
    publicKey,
    use: 'sig',
    kid: keyid
  }
  res.send(serialize([key]))
})

app.post('/buy', (req, res) => {
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

    { algorithm: 'RS256', keyid }
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

app.listen(port, () => console.log(`Shop app listening on port ${port}!`))
