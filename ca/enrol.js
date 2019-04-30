const r = require('rethinkdbdash')({
  port: 28016,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter

async function enrol(req, res) {
  const { endpoint, organizationId } = req.body
  const results = await r.table('keys').filter({ organizationId })

  if (!results.length) {
    const result = await r.table('keys').insert({ endpoint, organizationId })
    return res.send(result)
  }

  return res
    .status(500)
    .send('you are already enroled. you should try using the update endpoint')
}

module.exports = enrol
