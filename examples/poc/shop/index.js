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
const port = process.env.SHOP_PORT
const ORGANIZATION_ID = process.env.PUBLISHER_ORG_ID
const { HASH_GENERATOR_URL } = process.env
const r = require('rethinkdbdash')({
  host: process.env.CA_DB_HOST || 'localhost',
  port: process.env.CA_DB_PORT || 28016,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter

app.use(require('cookie-parser')())

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/buy', formReader.none(), async (req, res) => {
  const keyToken = req.cookies.keyToken
  const results = await r.table('private_keys_for_poc').filter({
    token: keyToken
  })

  const { privateKey, kid } = results[0]

  const incommingReceipt = req.body

  const { id } = req.query

  const receipt = {
    organizationId: incommingReceipt.orgId,
    shopName: incommingReceipt.businessName,
    lineItems: [
      {
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
      }
    ],
    receiptDateTime: moment(
      incommingReceipt.date + 'T' + incommingReceipt.time
    ),
    receiptCode: incommingReceipt.ref,
    currencyCode: incommingReceipt.currency,
    vat: incommingReceipt.tax,
    extendedAmount: incommingReceipt.amount, // Not in standard..?
    invoice: incommingReceipt.invoice && incommingReceipt.invoice === 'on'
  }
  const {
    body: { hash }
  } = await got(`${HASH_GENERATOR_URL}/generate-hash`, {
    method: 'POST',
    json: true,
    body: receipt
  })

  const token = jwt.sign(
    {
      hash
    },
    privateKey,
    {
      algorithm: 'RS256',
      keyid: kid,
      issuer: ORGANIZATION_ID
    }
  )

  if (receipt.invoice) {
    got(`${process.env.USER_ACCOUNTING_URL}/receipts`, {
      json: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        hash,
        receipt: {
          organizationId: incommingReceipt.orgId,
          shopName: incommingReceipt.businessName,
          lineItems: [
            {
              description: incommingReceipt.articleName,
              tax: {
                amount: incommingReceipt.tax,
                percent: (incommingReceipt.tax / incommingReceipt.amount) * 100
              },
              quantity: 1,
              unitCostPrice: incommingReceipt.amount,
              discountAmount: 0
            }
          ],
          invoiceDateTime: moment(
            incommingReceipt.date + 'T' + incommingReceipt.time
          ),
          invoiceCode: incommingReceipt.ref,
          invoiceSeriesNumber: incommingReceipt.seriesNumber,
          currencyCode: incommingReceipt.currency,
          vat: incommingReceipt.tax,
          extendedAmount: incommingReceipt.amount, // Not in standard..?
          invoice: incommingReceipt.invoice && incommingReceipt.invoice === 'on'
        }
      }
    })
  } else {
    got(`${process.env.MAIL_URL}/emails?id=${id}`, {
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
  }

  try {
    await got(`${process.env.HASH_REGISTRY_URL}/register-receipt`, {
      method: 'POST',
      json: true,
      body: {
        token
      }
    })
  } catch (error) {
    console.log('Error registering receipt', error.body)
    return res
      .status(500)
      .send(
        JSON.stringify(
          'Kunda inte registrera kvitto i hash-registret, har du registrerat dig?'
        )
      )
  }

  res.sendStatus(200)
})

app.post('/enroll', async (_, res) => {
  try {
    const { body } = await got(`${process.env.CA_URL}/enroll`, {
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
