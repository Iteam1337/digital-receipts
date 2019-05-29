const r = require('rethinkdbdash')({
  host: process.env.REGISTRY_DB_HOST,
  port: process.env.REGISTRY_DB_PORT,
  db: 'hash_registry'
}) // TODO remove rethinkdb or move to adapter
const jwt = require('jsonwebtoken')
const retrieveKey = require('./retrieveKey')

async function registerReceipt(req, res) {
  let key
  const {
    token
  } = req.body
  const {
    header: {
      kid
    },
    payload: {
      iss
    }
  } = jwt.decode(token, {
    complete: true
  })
  try {
    key = await retrieveKey(kid, iss)
  } catch (error) {
    return res.status(500).send(error.message)
  }
  const {
    hash,
    organizationId
  } = jwt.verify(token, key, {
    algorithms: ['RS256', 'RS512']
  })

  const existing = await r.table('registered_receipts').filter({
    hash
  })

  if (existing.length) {
    const message = 'this receipt has already been registered'
    console.debug(message, hash)
    return res.status(500).send(message)
  }

  const result = await r.table('registered_receipts').insert({
    hash,
    registerOrgId: organizationId
  })
  res.send(result)
}

module.exports = registerReceipt