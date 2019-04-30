const r = require('rethinkdbdash')({
  db: 'hash_registry'
}) // TODO remove rethinkdb or move to adapter

async function registerReceipt({ hash, organizationId }) {
  const existing = await r.table('receipts').filter({ hash })
  if (existing.length) {
    console.debug('this receipt has already been registered ', hash)
  }
  await r.table('receipts').insert({ hash, organizationId })
}

module.exports = registerReceipt
