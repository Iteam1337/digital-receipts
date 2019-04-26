const express = require('express')
const got = require('got')
const app = express()
const port = 9000
const uuid = require('uuid/v4')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/buy', (req, res) => {
  got('http://localhost:7900/emails', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hash: Buffer.from(uuid()).toString('base64'),
      receipt: {
        shopName: 'tågresor.se',
        items: ['Stockholm Malmö resa'],
        amount: 411,
        currency: 'SEK',
        vat: 24.66,
        vatPercent: 6,
        date: new Date()
      }
    })
  })
  res.sendStatus(200)
})

app.listen(port, () => console.log(`Shop app listening on port ${port}!`))
