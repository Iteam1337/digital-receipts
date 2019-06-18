require('dotenv').config({
  path: process.cwd() + '/../.env'
})
const express = require('express')
const {
  enrollPublisher,
  enrollReporter
} = require('./enroll')
const getEndpoint = require('./getEndpoint')
const app = express()
const port = process.env.CA_PORT
const r = require('rethinkdbdash')({
  host: process.env.CA_DB_HOST || 'localhost',
  port: process.env.CA_DB_PORT || 28016,
  db: 'ca'
}) // TODO remove rethinkdbdash or use adapter for it


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
    success,
    tutorial
  } = req.query

  res.send(`
  <h2 style="color: rgb(135, 129, 211)">Registrera mig som kvittoutgivare</h2>
  <form action="/enroll-publisher" method="POST">
  <label for="publisher-org-id"> Org Id utgivare </label>
  <br>
  <input ${tutorial ? "readonly" : ""} name="organizationId" id="publisher-org-id" type="input" value="${
    process.env.PUBLISHER_ORG_ID
  }"/>
  <br>

  <label for="publisher-endpoint"> Webbaddress för publika nycklar</label>
  <br>
  <input ${tutorial ? "readonly" : ""} name="endpoint" id="publisher-endpoint"="input" value="${
    process.env.SHOP_URL
  }/jwks"  />

  <br>
  <input type="submit" value="Registrera"/>
  </form>

  <h2 style="color: rgb(135, 129, 211)">Registrera mig som konterare</h2>
  <form action="/enroll-reporter" method="POST">
  <label for="reporter-org-id"> Org Id utgivare </label>
  <br>
  <input ${tutorial ? "readonly" : ""} name="organizationId" id="reporter-org-id" type="input" value="${
    process.env.USER_ACCOUNTING_ORG_ID
  }"/>
  <br>

  <label for="reporter-endpoint"> Webbaddress för publika nycklar</label>
  <br>
  <input ${tutorial ? "readonly" : ""} name="endpoint" id="reporter-endpoint"="input" value="${
    process.env.USER_ACCOUNTING_URL
  }/jwks"  />

  <br>
  <input type="submit" value="Registrera"/>
  </form>

  ${
    success === undefined
      ? ``
      : success === 'true'
      ? `<div id="success-msg" style="color: green; font-size:30px; top:16px; left: 25px; z-index: 11;"> Ditt företag är nu registrerat! &#9989</div>`
      : `<div style="color: red" id="success-msg"> Den här organisationen är redan registrerad.`
  }
  <script>
    setTimeout(() => {
      document.getElementById(
        'success-msg'
      ).innerHTML = ''
    }, 3500)
  </script>
  `)
})

app.get('/endpoints/:organizationId', getEndpoint)

app.listen(port, () => {
  console.log('CA running on ', port)
})