const r = require('rethinkdbdash')({
  host: process.env.CA_DB_HOST || 'localhost',
  port: process.env.CA_DB_PORT || 28015,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter

async function getEndpoint(req, res) {
  const {
    organizationId
  } = req.params
  const results = await r.table('keys').filter({
    organizationId
  })
  if (!results.length) {
    return res.sendStatus(404)
  }
  res.send(results[0])
}
module.exports = getEndpoint