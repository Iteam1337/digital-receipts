const r = require('rethinkdbdash')({
  port: 28016,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter

async function getEndpoint(req, res) {
  const {
    organizationId
  } = req.params
  const results = await r.table('keys').filter({
    organizationId
  })
  res.send(results[0])
}
module.exports = getEndpoint