const r = require('rethinkdbdash')({
  db: 'hash_registry'
})


async function useReceipt(req, res) {
  const {
    receipt
  } = req.body
  await r.table('receipts').insert(receipt)
}
module.exports = useReceipt