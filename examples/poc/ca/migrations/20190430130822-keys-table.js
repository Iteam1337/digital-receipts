exports.up = function(r, connection) {
  return r.tableCreate('keys').run(connection)
}

exports.down = function(r, connection) {
  return r.tableDrop('keys').run(connection)
}
