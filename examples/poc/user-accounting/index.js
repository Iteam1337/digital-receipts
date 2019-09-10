const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const port = 8900
const chokidar = require('chokidar')
let receipts = []
const QrCode = require('qrcode-reader')
const receiptCategories = require('./assets/receiptCategories')
const jimp = require('jimp')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const jimpRead = util.promisify(jimp.read)
const moment = require('moment')
const got = require('got')
const jwt = require('jsonwebtoken')
const qrcode = require('qrcode')
const { readFileSync } = require('fs')
const privateKey = readFileSync(`${__dirname}/keys/private_key.pem`)
const publicKey = readFileSync(`${__dirname}/keys/public_key.pem`, 'utf8')
require('dotenv').config({
  path: process.cwd() + '/../.env'
})

const r = require('rethinkdbdash')({
  host: process.env.CA_DB_HOST || 'localhost',
  port: process.env.CA_DB_PORT || 28016,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter

const USER_ACCOUNTING_ORG_ID = process.env.USER_ACCOUNTING_ORG_ID

const watcher = chokidar.watch(`${__dirname}/receipts`, {
  persistent: true
})

function readReceiptJson(receiptName) {
  const imgPath = `${receiptName}.png`
  const jsonPath = `${__dirname}/receipts/${receiptName}.json`
  const json = fs.readFileSync(jsonPath)
  const data = JSON.parse(json)
  return {
    img: imgPath,
    receipt: data
  }
}

watcher
  .on('add', async function(path) {
    if (path.endsWith('.json')) {
      console.log('new receipt')
      const receiptName = path
        .replace(`${__dirname}/receipts/`, '')
        .replace('.json', '')
      const receipt = readReceiptJson(receiptName)

      receipts.push(receipt)
      io.emit('receipt', receipt)
    }
  })
  .on('change', function(path) {
    io.emit('receipts', receipts)
    console.log('File', path, 'has been changed')
  })
  .on('unlink', function(path) {
    console.log('File', path, 'has been removed')
  })
  .on('error', function(error) {
    console.error('Error happened', error)
  })

app.use(cors())
app.use(require('body-parser').json())
app.use(
  require('body-parser').urlencoded({
    extended: true
  })
)

app.use(require('cookie-parser')())

app.get('/expenses', (_, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.get('/attestation', (_, res) => {
  res.sendFile(`${__dirname}/attestation.html`)
})

app.get('/report-receipt/:receiptName', async (req, res) => {
  const { receiptName } = req.params

  const digitalDeceipt = readReceiptJson(receiptName).receipt
  const { receipt } = digitalDeceipt

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
      <link rel="stylesheet" type="text/css" href="/intro.js/introjs.css"/>
      </head>
      <body>
        <form action="/report-receipt/${digitalDeceipt.hash}" method="POST">
        <label for="id_select">Typ av kvitto</label>
        <select id="id_select" name="category">
          ${receiptCategories
            .map(x => `<option value=${x.id}>${x.term}</option>`)
            .join('')}
        </select>

        <label for="id_scope">Syfte</label>
        <input id="id_scope" type="text" value='' name="scope"/>

        <label for="id_land">Land</label>
        <input id="id_land" type="text" readonly="readonly" value='Sverige' name="country"/>

        <label for="id_date">Datum</label>
        <input id="id_date" type="text" name="date" readonly="readonly" value='${moment(
          receipt.receiptDateTime
        ).format('YYYY-MM-DD')}'/>

        <label for="id_amount">Belopp</label>
        <input id="id_amount" type="text" name="amount" readonly="readonly" value='${
          receipt.extendedAmount
        }'/>

        <label for="id_vat">Moms</label>
        <input id="id_vat" type="text" name="vat" readonly="readonly" value='${
          receipt.vat
        }'/>

        <input type="hidden" id="id_organizationId" name="organizationId" value='${
          receipt.organizationId
        }'/>

        <input data-intro="Spara kvittot för att avvakta attesterande av ekonomiansvarig" type="submit" value="Spara"/>
        <input type="button" value="Tillbaka" onclick="location.href='/expenses';"/>
        </form>
        <script type="text/javascript" src="/intro.js/intro.js"></script>
        <script type="text/javascript">
          const intro = introJs()
          intro.setOptions({'hidePrev': true, 'hideNext': true, 'showStepNumbers': false, 'skipLabel': 'Hoppa över demonstration', 'doneLabel': 'Till attesteringsvyn', 'nextLabel': 'Nästa'})
          if (localStorage.getItem('tutorial')) {
            intro.start()
          }
        </script>
      </body>
    </html>
    `
  res.send(html)
})

function setReceiptAsSaved(hash) {
  receipts = receipts.map(r => ({
    ...r,
    receipt: {
      ...r.receipt,
      saved: r.receipt.hash === hash || r.receipt.saved
    }
  }))

  receipts.forEach(r => {
    if (r.receipt.hash === hash) {
      fs.writeFileSync(
        `${__dirname}/receipts/${r.img.replace('.png', '.json')}`,
        JSON.stringify(r.receipt)
      )
    }
  })
}

function setReceiptAsDone(hash) {
  receipts = receipts.map(r => ({
    ...r,
    receipt: {
      ...r.receipt,
      done: r.receipt.hash === hash || r.receipt.done
    }
  }))
  receipts.forEach(r => {
    if (r.receipt.hash === hash) {
      fs.writeFileSync(
        `${__dirname}/receipts/${r.img.replace('.png', '.json')}`,
        JSON.stringify(r.receipt)
      )
    }
  })
}

function setReceiptAsNotSaved(hash) {
  receipts = receipts.map(r => {
    if (r.receipt.hash !== hash) {
      return r
    }
    return {
      ...r,
      receipt: {
        ...r.receipt,
        saved: false
      }
    }
  })
  receipts.forEach(r => {
    if (r.receipt.hash === hash) {
      fs.writeFileSync(
        `${__dirname}/receipts/${r.img.replace('.png', '.json')}`,
        JSON.stringify(r.receipt)
      )
    }
  })
}

app.post('/report-receipt/:hash', async (req, res) => {
  const { hash } = req.params
  try {
    const keyToken = req.cookies.reporterKeyToken
    const results = await r.table('private_keys_for_poc').filter({
      token: keyToken
    })

    const { privateKey, kid } = results[0]

    const token = jwt.sign(
      {
        hash
      },
      privateKey,
      {
        algorithm: 'RS256',
        keyid: kid,
        issuer: USER_ACCOUNTING_ORG_ID
      }
    )

    // try {
    await got(`${process.env.HASH_REGISTRY_URL}/check-receipt`, {
      method: 'POST',
      json: true,
      body: {
        token
      }
    })
  } catch (error) {
    let message = error.body ? error.body : error
    console.log(
      'failed to check receipt:',
      message === 'Public key endpoint not found'
    )

    if (message === 'Public key endpoint not found') {
      message =
        'Kunda inte registrera kvitto i hash-registret, har du registrerat dig?'
    }
    setReceiptAsNotSaved(hash)
    console.log(message)

    return res.redirect(`/expenses?error=${message}`)
  }
  console.log('set it')

  setReceiptAsSaved(hash)
  res.redirect('/expenses?success=true')
})

app.post('/attest', async (req, res) => {
  const savedReceipts = receipts.filter(
    r => (r.receipt.saved || r.receipt.receipt.invoice) && !r.receipt.done
  )

  try {
    const keyToken = req.cookies.reporterKeyToken
    const results = await r.table('private_keys_for_poc').filter({
      token: keyToken
    })

    const { privateKey, kid } = results[0]

    await Promise.all(
      savedReceipts.map(({ receipt: { hash } }) => {
        const token = jwt.sign(
          {
            hash,
            reporterOrgId: USER_ACCOUNTING_ORG_ID
          },
          privateKey,
          {
            algorithm: 'RS256',
            keyid: kid,
            issuer: USER_ACCOUNTING_ORG_ID
          }
        )
        return got(`${process.env.HASH_REGISTRY_URL}/use-receipt`, {
          method: 'POST',
          json: true,
          body: {
            token
          }
        }).then(() => setReceiptAsDone(hash))
      })
    )
  } catch (error) {
    console.log('ex br0ke', error)
    return res.redirect(`/attestation?error=${error.body ? error.body : error}`)
  }
  res.redirect('/attestation?success=true')
})

app.post('/receipts', (req, res) => {
  const now = Date.now()
  qrcode.toFile(`./receipts/receipt-${now}.png`, JSON.stringify(req.body))
  fs.writeFileSync(`./receipts/receipt-${now}.json`, JSON.stringify(req.body))
  res.send({})
})

app.use(express.static('receipts'))
app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use(express.static('partials'))
app.get('/', (_, res) => res.redirect('/expenses'))
http.listen(port, () => console.log(`User accounting running on ${port}!`))

io.on('connection', socket => {
  console.log('a socket connected!')
  socket.emit('receipts', receipts)
})
