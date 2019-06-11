exports.up = function (r, connection) {
  return r.tableCreate('used_hashes').run(connection)
      .then(() => r.tableCreate('registered_hashes').run(connection))
}

exports.down = function (r, connection) {
  return r.tableDrop('registered_hashes').run(connection)
      .then(() => r.tableDrop('used_hashes').run(connection))
}