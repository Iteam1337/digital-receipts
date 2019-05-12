const r = require('rethinkdbdash')({
  db: 'hash_registry'
})


async function useReceipt(req, res, next) {
  const {
    receipt
  } = req.body
  if (await isAlreadyInDb(receipt)) {
    res.status(500).send('The receipt-hash has already been used in this context')
    return next()
  }
  await r.table('used_receipts').insert(receipt)
  res.sendStatus(200)
}

async function isAlreadyInDb(receipt) {
  const receipts = await r.table('used_receipts').filter({
    hash: receipt.hash
  })
  return Boolean(receipts.length)
}
module.exports = useReceipt