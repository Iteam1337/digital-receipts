require('dotenv').config({
  path: process.cwd() + '/../.env'
})
const express = require('express')
const app = express()
const moment = require('moment')
const multer = require('multer')
const formReader = multer()
const got = require('got')
const jwt = require('jsonwebtoken')
const {
  readFileSync
} = require('fs')
const {
  serialize
} = require('jwks-provider')
const crypto = require('crypto')
const privateKey = readFileSync(`${__dirname}/keys/private_key.pem`)
const publicKey = readFileSync(`${__dirname}/keys/public_key.pem`, 'utf8')
const port = process.env.SHOP_PORT
const ORGANIZATION_ID = process.env.PUBLISHER_ORG_ID
const {
  HASH_GENERATOR_URL
} = process.env

const kid = crypto
  .createHash('SHA256')
  .update(publicKey)
  .digest('hex')
// TODO move keyid creation to a key provider

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/jwks', async (_, res) => {
  const key = {
    publicKey,
    use: 'sig',
    kid
  } // TODO this should be part of key provider
  res.send(serialize([key]))
})

app.post('/buy', formReader.none(), async (req, res) => {
  const incommingReceipt = req.body

  const receipt = {
    organizationId: incommingReceipt.orgId,
    shopName: incommingReceipt.businessName,
    lineItems: [{
      description: incommingReceipt.articleName,
      tax: {
        amount: incommingReceipt.tax,
        percent: (incommingReceipt.tax / incommingReceipt.amount) * 100
      },
      quantity: 1,
      unitCostPrice: incommingReceipt.amount,
      discountAmount: 0
      // sequenceNumber: 1
      // actualSalesUnitPrice: amount - discount,
      // ExtendedAmount,
      // ExtendedDiscountAmount,
      // Identifier by choice of supplier
      // itemID
    }],
    receiptDateTime: moment(
      incommingReceipt.date + 'T' + incommingReceipt.time
    ),
    receiptCode: incommingReceipt.ref,
    currencyCode: incommingReceipt.currency,
    vat: incommingReceipt.tax,
    extendedAmount: incommingReceipt.amount // Not in standard..?
  }
  const {
    body: {
      hash
    }
  } = await got(`${HASH_GENERATOR_URL}/generate-hash`, {
    method: 'POST',
    json: true,
    body: receipt
  })

  const token = jwt.sign({
      hash
    },
    privateKey, {
      algorithm: 'RS256',
      keyid: kid,
      issuer: ORGANIZATION_ID
    }
  )

  got(`${process.env.MAIL_URL}/emails`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hash,
      receipt
    })
  })
  try {
    await got(`${process.env.HASH_REGISTRY_URL}/register-receipt`, {
      method: 'POST',
      json: true,
      body: {
        token
      }
    })
  } catch (error) {
    console.log('Error registering receipt', error.body);
    return res.status(500).send(JSON.stringify('Kunda inte registrera kvitto i hash-registret, har du registrerat dig?'))
  }
  res.sendStatus(200)
})

app.post('/enroll', async (_, res) => {
  try {
    const {
      body
    } = await got(`${process.env.CA_URL}/enroll`, {
      method: 'POST',
      json: true,
      body: {
        organizationId: ORGANIZATION_ID,
        endpoint: process.env.SHOP_URL + '/jwks'
      }
    })
    res.send(body)
  } catch (err) {
    return res.status(err.statusCode).send(err.body)
  }
})
app.use(express.static('public'))
app.use(express.static('node_modules'))
app.listen(port, () => console.log(`Shop app listening on port ${port}!`))