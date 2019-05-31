const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const validatePayload = require('./validatePayload')
const generateHash = require('./generateHash')
const port = 3000

server.use(bodyParser.json())

/**
 * @api {post} /generate-hash Request a hash for a receipt
 * @apiName Generate
 * @apiGroup Hash
 *
 * @apiParam {String} organizationId Identifier by choice of supplier
 * @apiParam {String} [description] Description
 * @apiParam {Number} quantity Quantity
 * @apiParam {Number} actualSalesUnitPrice Actual Sales Unit Price
 * @apiParam {Number} extendedAmount Extended Amount
 * @apiParam {Number} extendedDiscountAmount Extended Discount Amount
 * @apiParam {Number} tax Tax
 *
 * @apiSuccess {String} hash The hash for the sent receipt.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "hash": "eyJmb28iOiJiYXIiLCJoZXJwIjoiZGVycCJ9"
 *     }
 *
 * @apiError InternalServerError Validation error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "InternalServerError"
 *     }
 */
server.post('/generate-hash', (req, res) => {
  const { body } = req
  try {
    validatePayload(body)
    res.send({ hash: generateHash(body) })
  } catch(ex) {
    console.error(ex)
    res.status(500).send(ex.message)
  }
})

server.use(express.static('doc'))

const app = server.listen(port, () => {
  console.info(`hash-generator listening on port ${port}`)
})

module.exports = app