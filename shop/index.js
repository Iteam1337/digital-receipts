const express = require('express')
const got = require('got')
const app = express()
const port = 9000
const { createHash } = require('../receipt-hash-generator')
const HASH_REGISTRY_URL = 'http://localhost:5500'
const ORGANIZATION_ID = '123'

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
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
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hash,
      organizationId: ORGANIZATION_ID
    })
  })

  res.sendStatus(200)
})

app.listen(port, () => console.log(`Shop app listening on port ${port}!`))
