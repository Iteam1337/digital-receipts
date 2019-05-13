const bodyParser = require('body-parser')
const express = require('express')
const {
  enrollPublisher,
  enrollReporter
} = require('./enroll')
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

app.post('/enroll-publisher', enrollPublisher)
app.post('/enroll-reporter', enrollReporter)
app.get('/enroll', (req, res) => {
  const {
    success
  } = req.query

  res.send(`
  <h2 style="color: rgb(135, 129, 211)">Registrera mig som kvittoutgivare/konterare</h2>
  <form action="/enroll-publisher" method="POST">
  <label for="publisher-org-id"> Org Id utgivare </label>
  <br>
  <input name="publisherOrganizationId" id="publisher-org-id" type="input" value="${process.env.PUBLISHER_ORG_ID}"/>
  <br>

  <label for="publisher-endpoint"> Webaddress för publika nycklar</label>
  <br>
  <input name="publisherEndpoint" id="publisher-endpoint"="input" value="${process.env.SHOP_URL}/jwks"  />

  <br>
  <input type="submit" value="Registrera"/>
  </form>
  ${success === undefined ? `` : success === 'true' ? `<div id="success-msg" style="color: green; font-size:30px; top:16px; left: 25px; z-index: 11;"> Successfully enrolled &#9989</div>` : `<div style="color: red" id="success-msg"> You are already enrolled. You should try using the update endpoint`}
  <script>
    setTimeout(() => {
      document.getElementById(
        'success-msg'
      ).innerHTML = ''
    }, 2500)
  </script>
  `)
})

app.get('/endpoints/:organizationId', getEndpoint)

app.listen(port, () => {
  console.log('CA running on ', port)
})