const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const r = require('rethinkdbdash')({
  host: process.env.REGISTRY_DB_HOST,
  port: process.env.REGISTRY_DB_PORT,
  db: 'hash_registry'
})
const registerReceipt = require('./registerReceipt')
const useReceipt = require('./useReceipt')
const checkReceipt = require('./checkReceipt')

const port = 5500
app.use(bodyParser.json())
app.use(bodyParser.text())
require('dotenv').config({
  path: process.cwd() + '/../.env'
})

app.get('/receipts', async (req, res) => {
  const registeredReceipts = await r.table('registered_receipts')

  const usedReceipts = await r.table('used_receipts')
  res.send(`
    <h2 style="color: rgb(135, 129, 211)">Kvittomatchning (hash-register)</h2>
    <h3>Publicerade kvitto-hashar</h3>
    <pre>${JSON.stringify(
      registeredReceipts.map(({ kid, hash }) => ({ kid, hash })),
      null,
      2
    )}</pre>
    <h3>Kostnadsförda kvitto-hashar</h3>
    <pre>${JSON.stringify(
      usedReceipts.map(({ kid, hash }) => ({ kid, hash })),
      null,
      2
    )}</pre>
    <script type="text/javascript">setTimeout(() => { location.reload()}, 3000)</script>
  `)
})

app.post('/register-receipt', registerReceipt)
app.post('/use-receipt', useReceipt)
app.post('/check-receipt', checkReceipt)

app.listen(port, () => {
  console.log('Hash-registry running on ', port)
})
