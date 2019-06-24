const r = {
  table: jest.fn(),
  insert: jest.fn(),
  filter: jest.fn()
}

r.table.mockReturnValue(r)
r.filter.mockReturnValue([])

module.exports = r