exports.up = function (r, connection) {
    return r.tableCreate('used_receipts').run(connection)
        .then(() => r.tableCreate('registered_receipts').run(connection))
        .then(() => r.tableDrop('receipts').run(connection))
}

exports.down = function (r, connection) {
    return r.tableDrop('registered_receipts').run(connection)
        .then(() => r.tableDrop('used_receipts').run(connection))
        .then(() => r.tableCreate('receipts').run(connection))
}