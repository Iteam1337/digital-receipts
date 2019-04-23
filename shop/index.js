const express = require('express')
const got = require('got')
const app = express()
const port = 9000

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html')
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
        shopName: 'Flygresor.se',
        items: ['Stockholm Malmö resa']
      }
    })
  })
  res.sendStatus(200)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
