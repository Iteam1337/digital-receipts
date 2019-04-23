const express = require('express')
const got = require('got')
const app = express()
const port = 9000

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
      hash: 'jdeuhhfgsfu',
      receipt: {
        shopName: 'tågresor.se',
        items: ['Stockholm Malmö resa']
      }
    })
  })
  res.sendStatus(200)
})

app.listen(port, () => console.log(`Shop app listening on port ${port}!`))