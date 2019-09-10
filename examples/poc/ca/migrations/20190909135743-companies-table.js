exports.up = function(r, connection) {
  return r.tableCreate('companies').run(connection)
}

exports.down = function(r, connection) {
  return r.tableDrop('companies').run(connection)
}
