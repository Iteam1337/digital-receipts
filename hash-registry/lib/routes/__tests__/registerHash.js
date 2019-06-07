jest.mock('../../adapters/rethink')

const registerHash = require('../registerHash')
const r = require('../../adapters/rethink')

describe('register hash route', () => {
  let req, res, hash, organizationId
  beforeEach(() => {
    hash = 'd21dsa='
    organizationId = '456'
    req = { hash, organizationId }
    res = {
      sendStatus: jest.fn()
    }
  })

  test('it stores the hash', async () => {
    registerHash(req, res)
    expect(r.insert).toHaveBeenCalledWith({
      hash,
      registerOrgId: organizationId
    })
  })
})
