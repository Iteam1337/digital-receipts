const r = require('rethinkdbdash')({
  host: process.env.CA_DB_HOST || 'localhost',
  port: process.env.CA_DB_PORT || 28016,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter

async function getKey(req, res) {
  const { kid } = req.params
  const results = await r.table('keys').filter({
    kid
  })
  if (!results.length) {
    return res.sendStatus(404)
  }
  res.send(results[0])
}
module.exports = getKey
