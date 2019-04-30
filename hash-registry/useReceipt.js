const r = require('rethinkdbdash')({
  db: 'hash_registry'
})

async function useReceipt(receipt) {
  await r.table('receipts').insert(receipt)
}
module.exports = useReceipt
