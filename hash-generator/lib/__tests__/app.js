const app = require('../app')
const request = require('supertest')

describe('generate hash route', () => {
  afterAll(() => app.close())

  test('it should respond to the POST request', async () => {
    const response = await request(app)
      .post('/generate-hash')
      .send({ foo: 'bar' })
    expect(response.statusCode).toBe(200)
  })

  test('it returns a hash for a payload', async () => {
    const response = await request(app)
      .post('/generate-hash')
      .send({ foo: 'bar' })
    expect(response.body).toEqual({ hash: expect.any(String) })
  })

  test('it fails when payload is not valid', async () => {
    const response = await request(app).post('/generate-hash')
    expect(response.statusCode).toBe(500)
  })

  test('it returns the same output for the same input', async () => {
    const firstResponse = await request(app)
      .post('/generate-hash')
      .send({ foo: 'bar' })
    const secondResponse = await request(app)
      .post('/generate-hash')
      .send({ foo: 'bar' })

    expect(firstResponse.body).toEqual(secondResponse.body)
  })

  test('it returns different outputs for the different inputs', async () => {
    const firstResponse = await request(app)
      .post('/generate-hash')
      .send({ foo: 'bar' })
    const secondResponse = await request(app)
      .post('/generate-hash')
      .send({ herp: 'derp' })

    expect(firstResponse.body).not.toEqual(secondResponse.body)
  })
})
