const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const validatePayload = require('./validatePayload')
const generateHash = require('./generateHash')
const port = process.env.PORT || 3000

server.use(
  bodyParser.urlencoded({
    extended: true
  })
)
server.use(bodyParser.json())

/**
 * @api {post} /generate-hash Request a hash for a receipt
 * @apiName Generate
 * @apiGroup Hash
 * @apiParam {String} currencyCode Currency Code in capital letters (ex SEK)
 * @apiParam {Number} extendedAmount Extended Amount
 * @apiParam {String} receiptDateTime Date and time when the transaction was made
 * @apiParam {String} receiptCode Receipt identifier in the issuer system
 * @apiParam {Number} vat Vat described as amount
 *
 * @apiSuccess {String} hash The hash for the sent receipt.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "currencyCode": "SEK",
 *       "extendedAmount": 100,
 *       "receiptDateTime": "2012-01-11T09:49:00+01:00",
 *       "receiptCode": "1560840755805",
 *       "vat": "25"
 *     }
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
  const {
    currencyCode,
    extendedAmount,
    receiptDateTime,
    receiptCode,
    vat
  } = req.body
  try {
    validatePayload({
      currencyCode,
      extendedAmount,
      receiptDateTime,
      receiptCode,
      vat
    })
    res.send({
      hash: generateHash({
        currencyCode,
        extendedAmount,
        receiptDateTime,
        receiptCode,
        vat
      })
    })
  } catch (ex) {
    console.error(ex)
    res.status(500).send(ex.message)
  }
})

server.use(express.static('doc'))

const app = server.listen(port, () => {
  console.info(`hash-generator listening on port ${port}`)
})

module.exports = app
