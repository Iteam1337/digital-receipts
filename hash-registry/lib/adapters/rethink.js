const r = require('rethinkdbdash')({
  host: process.env.REGISTRY_DB_HOST,
  port: process.env.REGISTRY_DB_PORT,
  db: process.env.REGISTRY_DB_NAME
})

module.exports = r
