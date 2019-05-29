exports.up = function(r, connection) {
  return r.tableCreate('receipts').run(connection)
}

exports.down = function(r, connection) {
  return r.tableDrop('receipts').run(connection)
}
