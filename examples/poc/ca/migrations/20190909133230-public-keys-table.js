exports.up = function(r, connection) {
  return r.tableCreate('private_keys_for_poc').run(connection)
}

exports.down = function(r, connection) {
  return r.tableDrop('private_keys_for_poc').run(connection)
}
