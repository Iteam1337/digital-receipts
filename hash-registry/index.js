const express = require('express')
const app = express()
const r = require('rethinkdbdash')({
  db: 'hash_registry'
})
const registerReceipt = require('./registerReceipt')
const useReceipt = require('./useReceipt')
const port = 5500

app.use(require('body-parser').json())

app.get('/receipts', async (req, res) => {
  const receipts = await r.table('receipts')
  res.send(`
    <pre>${JSON.stringify(receipts, null, 2)}</pre>
    <script type="text/javascript">setTimeout(() => { location.reload()}, 3000)</script>
  `)
})

app.post('/register-receipt', async (req, res) => {
  const { hash, organizationId } = req.body
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
