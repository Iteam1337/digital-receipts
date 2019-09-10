const r = require('rethinkdbdash')({
  host: process.env.REGISTRY_DB_HOST,
  port: process.env.REGISTRY_DB_PORT,
  db: 'hash_registry'
})
const jwt = require('jsonwebtoken')
const retrieveKey = require('./retrieveKey')

async function useReceipt(req, res, next) {
  const { token } = req.body
  const {
    header: { kid },
    payload: { iss }
  } = jwt.decode(token, {
    complete: true
  })
  const key = await retrieveKey(kid, iss)
  const { hash, reporterOrgId } = jwt.verify(token, key, {
    algorithms: ['RS256', 'RS512']
  })

  if (await isAlreadyInDb({ hash, reporterOrgId })) {
    res
      .status(500)
      .send('The receipt-hash has already been used in this context')
    return next()
  }
  await r.table('used_receipts').insert({ hash, kid })
  res.send('')
}

async function isAlreadyInDb(receipt) {
  const receipts = await r.table('used_receipts').filter({
    hash: receipt.hash
  })
  return Boolean(receipts.length)
}
module.exports = useReceipt
