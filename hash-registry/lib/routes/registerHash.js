const r = require('../adapters/rethink')

async function registerHash(req, res) {
  const { hash, organizationId } = req
  const existing = await r.table('registered_hashes').filter({
    hash
  })

  if (existing.length) {
    const message = 'this hash has already been registered'
    console.debug(message, hash)
    return res.status(500).send(message)
  }

  await r.table('registered_hashes').insert({
    hash,
    registerOrgId: organizationId
  })

  res.sendStatus(201)
}

module.exports = registerHash
