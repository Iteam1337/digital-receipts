const bodyParser = require('body-parser')
const express = require('express')
const enrol = require('./enrol')
const getEndpoint = require('./getEndpoint')
const app = express()
const port = 5700 // TODO get app PORT from config
const r = require('rethinkdbdash')({
  port: 28016,
  db: 'ca'
}) // TODO remove rethinkdbdash or use adapter for it
require('dotenv').config({
  path: process.cwd() + '/../.env'
});

app.use(bodyParser.json())

app.get('/', async (_, res) => {
  const keys = await r.table('keys')
  res.send(`
    <h1>CA</h1>
    <pre>${JSON.stringify(keys, null, 2)}</pre>
    <script type="text/javascript">setTimeout(() => { location.reload()}, 3000)</script>
  `)
})

app.post('/enrol', enrol)

app.get('/endpoints/:organizationId', getEndpoint)

app.listen(port, () => {
  console.log('CA running on ', port)
})