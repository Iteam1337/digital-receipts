const r = {
  table: jest.fn(),
  insert: jest.fn()
}

r.table.mockReturnValue(r)

module.exports = r