require('dotenv').config({
  path: process.cwd() + '/.env'
})
const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const verifySignature = require('./middleware/verifySignature')
const registerHash = require('./routes/registerHash')
const useHash = require('./routes/useHash')
const verifyHash = require('./routes/verifyHash')

server.use(
  bodyParser.urlencoded({
    extended: true
  })
)
server.use(bodyParser.json())
server.use(express.static('doc'))

/**
 * @api {post} /register-hash Register the hash of a receipt
 *
 * @apiName Register
 * @apiGroup Hash
 *
 * @apiParam {String} token Signed <a href="#parameter-examples-Hash-Register-0_0_0-1">payload</a> following <a target="_blank" href="https://tools.ietf.org/html/rfc7519">JWT standard</a>
 *
 * @apiParamExample {json} Payload to be signed
 *  {
 *    "hash": "sdjkhds90902890dsadnjds9cxlmcsa08="
 *  }
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 Created
 *
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
server.post('/register-hash', verifySignature, registerHash)

/**
 * @api {post} /use-hash Use a hash that has been registered
 *
 * @apiName Use
 * @apiGroup Hash
 *
 * @apiParam {String} token Signed <a href="#parameter-examples-Hash-Use-0_0_0-1">payload</a> following <a target="_blank" href="https://tools.ietf.org/html/rfc7519">JWT standard</a>
 *
 * @apiParamExample {json} Payload to be signed
 *  {
 *    "hash": "sdjkhds90902890dsadnjds9cxlmcsa08="
 *  }
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 Created
 *
 * @apiErrorExample {json} Use error
 *    HTTP/1.1 500 Internal Server Error
 */
server.post('/use-hash', verifySignature, useHash)

/**
 * @api {post} /verify-hash Verify if a hash has already been used
 *
 * @apiName Verify
 * @apiGroup Hash
 *
 * @apiParam {String} token Signed <a href="#parameter-examples-Hash-Verify-0_0_0-1">payload</a> following <a target="_blank" href="https://tools.ietf.org/html/rfc7519">JWT standard</a>
 *
 * @apiParamExample {json} Payload to be signed
 *  {
 *    "hash": "sdjkhds90902890dsadnjds9cxlmcsa08="
 *  }
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 Created
 *
 * @apiErrorExample {json} Verify error
 *    HTTP/1.1 500 Internal Server Error
 */
server.post('/verify-hash', verifySignature, verifyHash)

const app = server.listen(port, () => {
  console.info(`hash-registry listening on port ${port}`)
})

module.exports = app


