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
      send: jest.fn(),
      sendStatus: jest.fn(),
      status: jest.fn()
    }
    res.status.mockReturnValue(res)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('it stores the hash', async () => {
    await registerHash(req, res)

    expect(r.insert).toHaveBeenCalledWith({
      hash,
      registerOrgId: organizationId
    })
    expect(res.sendStatus).toHaveBeenCalledWith(201)
  })

  test('it sends an error if the hash has been registered before', async () => {
    r.filter.mockReturnValueOnce([{ id: '123' }])
    await registerHash(req, res)

    expect(r.insert).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
  })
})
