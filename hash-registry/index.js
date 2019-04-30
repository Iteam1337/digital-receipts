const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const r = require('rethinkdbdash')({
  db: 'hash_registry'
})
const registerReceipt = require('./registerReceipt')
const useReceipt = require('./useReceipt')
const retrieveKey = require('./retrieveKey')
const jwt = require('jsonwebtoken')
const port = 5500
app.use(bodyParser.json())
app.use(bodyParser.text())

app.get('/receipts', async (req, res) => {
  const receipts = await r.table('receipts')
  res.send(`
    <pre>${JSON.stringify(receipts, null, 2)}</pre>
    <script type="text/javascript">setTimeout(() => { location.reload()}, 3000)</script>
  `)
})

app.post('/register-receipt', async (req, res) => {
  console.log(req.body)
  const {
    header: { kid }
  } = jwt.decode(req.body, { complete: true })
  const key = await retrieveKey(kid)
  const { hash, organizationId } = jwt.verify(req.body, key, {
    algorithms: ['RS256', 'RS512']
  })
  // return res.send({})
  const result = await registerReceipt({ hash, organizationId })
  res.send(result)
})

app.post('/use-receipt', async (req, res) => {
  const { receipt } = req.body
  return res.send({})
  const result = await useReceipt(receipt)
  res.send(result)
})

app.listen(port, () => {
  console.log('Hash-registry running on ', port)
})
