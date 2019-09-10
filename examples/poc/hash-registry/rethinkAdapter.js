const r = require('rethinkdbdash')({
  host: process.env.REGISTRY_DB_HOST,
  port: process.env.REGISTRY_DB_PORT,
  db: 'hash_registry'
}) // TODO remove rethinkdb or move to adapter

module.exports = r