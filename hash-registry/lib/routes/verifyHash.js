const r = require('../adapters/rethink')

async function verifyHash(req, res) {
  const { hash, organizationId } = req
  res.status(500).send('not yet implemented')
}

module.exports = verifyHash
