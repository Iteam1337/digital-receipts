require('dotenv').config({
  path: process.cwd() + '/../.env'
})
const express = require('express')
const { enrollPublisher, enrollReporter } = require('./enroll')
const getEndpoint = require('./getEndpoint')
const app = express()
const port = process.env.CA_PORT
const r = require('rethinkdbdash')({
  host: process.env.CA_DB_HOST || 'localhost',
  port: process.env.CA_DB_PORT || 28016,
  db: 'ca'
}) // TODO remove rethinkdbdash or use adapter for it
const enrollPage = require('./routes/enrollPage')
const generateKeys = require('./routes/generateKeys')
const { key } = require('./keyProvider')
const { serialize } = require('jwks-provider')
const getKey = require('./routes/getKey')

app.get('/jwks', async (_, res) => {
  res.send(serialize([key]))
})
app.use(
  require('body-parser').urlencoded({
    extended: true
  })
)
app.get('/', async (_, res) => {
  const keys = await r.table('keys')
  res.send(`
    <h2 style="color: rgb(135, 129, 211)">Tillitslogik för system-integrationer</h2>

    <pre>${JSON.stringify(
      keys.map(({ kid, key, type }) => ({ kid, key, type })),
      null,
      2
    )}</pre>
    <script type="text/javascript">setTimeout(() => { location.reload()}, 3000)</script>
  `)
})

app.post('/enroll-publisher', enrollPublisher)
app.post('/enroll-reporter', enrollReporter)
app.get('/enroll', enrollPage)
app.get('/keys', generateKeys)

app.get('/endpoints/:organizationId', getEndpoint)
app.get('/key/:kid', getKey)

app.listen(port, () => {
  console.log('CA running on ', port)
})
