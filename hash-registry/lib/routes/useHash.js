const r = require('../adapters/rethink')

async function useHash(req, res) {
  const { hash, organizationId } = req
  const existing = await r.table('used_hashes').filter({
    hash
  })
  if (existing.length) {
    const message = 'this hash has already been used in this context'
    console.debug(message, hash)
    return res.status(500).send(message)
  }

  await r.table('used_hashes').insert({ hash, reporterOrgId: organizationId })
  res.sendStatus(201)
}

module.exports = useHash
