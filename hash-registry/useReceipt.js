const r = require('rethinkdbdash')({
  db: 'hash_registry'
})


async function useReceipt(req, res) {
  const {
    receipt
  } = req.body
  await r.table('used-receipts').insert(receipt)
}
module.exports = useReceipt