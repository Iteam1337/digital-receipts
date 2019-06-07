const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const registerHash = require('./routes/registerHash')
// const verifySignature = require('./middleware/verifySignature')

server.use(
  bodyParser.urlencoded({
    extended: true
  })
)
server.use(bodyParser.json())
server.use(express.static('doc'))

/**
 * @api {post} /register-hash Register the hash of a receipt
 * @apiName Register
 * @apiGroup Hash
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 Created
 *
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
// server.post('/register-hash', verifySignature, registerHash)
server.post('/register-hash', (_, res) => res.sendStatus(201))

// server.post('/use-receipt', useReceipt)
// server.post('/check-receipt', checkReceipt)

const app = server.listen(port, () => {
  console.info(`hash-registry listening on port ${port}`)
})

module.exports = app
