const r = require('rethinkdbdash')({
  db: 'hash_registry'
})


async function useReceipt(req, res) {
  const {
    receipt
  } = req.body
  if (isAlreadyInDb(receipt)) {
    res.send(500, 'Trying to insert receipt-hash already present')
  }
  await r.table('used_receipts').insert(receipt)
  res.send(200)
}

async function isAlreadyInDb(receipt) {
  const receipts = await r.table('used_receipts').filter({
    hash: receipt.hash
  })
  return Boolean(receipts.length)
}
module.exports = useReceipt