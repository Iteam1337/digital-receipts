jest.mock('../../adapters/rethink')

const useHash = require('../useHash')
const r = require('../../adapters/rethink')

describe('use hash route', () => {
  let req, res, hash, organizationId
  beforeEach(() => {
    hash = 'd21dsa='
    organizationId = '456'
    req = { hash, organizationId }
    res = {
      send: jest.fn(),
      sendStatus: jest.fn(),
      status: jest.fn()
    }
    res.status.mockReturnValue(res)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('it stores the hash as used', async () => {
    await useHash(req, res)
    expect(r.table).toHaveBeenCalledWith('used_hashes')
    expect(r.insert).toHaveBeenCalledWith({
      hash,
      reporterOrgId: organizationId
    })
  })
  test('it sends an error if the hash has been used before', async () => {
    r.filter.mockReturnValueOnce([{ id: '123' }])
    await useHash(req, res)

    expect(r.insert).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
  })
})
