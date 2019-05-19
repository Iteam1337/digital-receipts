const express = require('express')
const got = require('got')
const jwt = require('jsonwebtoken')
const {
  readFileSync
} = require('fs')
const {
  serialize
} = require('jwks-provider')
const crypto = require('crypto')
const {
  createHash
} = require('./receipt-hash-generator')
const privateKey = readFileSync(`${__dirname}/keys/private_key.pem`)
const publicKey = readFileSync(`${__dirname}/keys/public_key.pem`, 'utf8')
const port = 9000 // TODO get PORT from config
const ORGANIZATION_ID = '123' // TODO get ORGANIZATION ID from config
const app = express()
require('dotenv').config({
  path: process.cwd() + '/../.env'
})

const kid = crypto
  .createHash('SHA256')
  .update(publicKey)
  .digest('hex')
// TODO move keyid creation to a key provider

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/jwks', async (_, res) => {
  const key = {
    publicKey,
    use: 'sig',
    kid
  } // TODO this should be part of key provider
  res.send(serialize([key]))
})

app.post('/buy', async (_, res) => {
  console.log('found')

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

  const token = jwt.sign({
      hash,
      organizationId: ORGANIZATION_ID
    },
    privateKey, {
      algorithm: 'RS256',
      keyid: kid,
      issuer: ORGANIZATION_ID
    }
  )

  got(`${process.env.MAIL_URL}/emails`, {
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
  try {
    await got(`${process.env.HASH_REGISTRY_URL}/register-receipt`, {
      method: 'POST',
      json: true,
      body: {
        token
      }
    })
  } catch (error) {
    console.log('Error registering receipt', error.body);
    return res.status(500).send(JSON.stringify('Could not register receipt, are you enrolled?'))
  }
  res.sendStatus(200)
})

app.post('/enroll', async (_, res) => {
  try {
    const {
      body
    } = await got(`${process.env.CA_URL}/enroll`, {
      method: 'POST',
      json: true,
      body: {
        organizationId: ORGANIZATION_ID,
        endpoint: process.env.SHOP_URL + '/jwks'
      }
    })
    res.send(body)
  } catch (err) {
    return res.status(err.statusCode).send(err.body)
  }
})

app.listen(port, () => console.log(`Shop app listening on port ${port}!`))