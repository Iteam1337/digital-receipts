const bodyParser = require('body-parser')
const express = require('express')
const enroll = require('./enroll')
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
app.use(
  require('body-parser').urlencoded({
    extended: true
  })
)
app.get('/', async (_, res) => {
  const keys = await r.table('keys')
  res.send(`
    <h2 style="color: rgb(135, 129, 211)">Tillitslogik för avsändar- och mottagarvalidering</h2>

    <pre>${JSON.stringify(keys, null, 2)}</pre>
    <script type="text/javascript">setTimeout(() => { location.reload()}, 3000)</script>
  `)
})

app.post('/enroll', enroll)
app.get('/enroll', (req, res) => {
  res.send(`
  <form action="/enroll" method="POST">

  <label for="publisher-org-id"> Org Id utgivare </label>
  <br>
  <input id="publisher-org-id" type="input" value="${process.env.lisherLISHER_ORGANIZATION_ID}"/>
  <br>

  <label for="publisher-public-key-route"> Org Id utgivare </label>
  <br>
  <input id="publisher-public-key-route"="input" value="${process.env.SHOP_URL}/jwks"  />

  <br>
  <input type="submit" value="Enroll"/>
  </form>

  `)
})

app.get('/endpoints/:organizationId', getEndpoint)

app.listen(port, () => {
  console.log('CA running on ', port)
})