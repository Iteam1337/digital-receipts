const r = require('../adapters/rethink')

async function registerHash(req, res) {
  await r.table('registered_hashes').insert({
    hash: req.hash,
    registerOrgId: req.organizationId
  })
  res.sendStatus(201)
}

module.exports = registerHash
