const express = require('express')
const app = express()
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
const USER_ACCOUNTING_ORG_ID = '987'

require('dotenv').config({
  path: process.cwd() + '/../.env'
});

fs.mkdir(`${__dirname}/receipts`, () => {})

const watcher = chokidar.watch(`${__dirname}/receipts`, {
  ignored: /^\./,
  persistent: true
})

async function readReceiptQR(path) {
  const imgPath = path.replace(`${__dirname}/receipts`, '')
  const imgBuffer = await readFile(`${__dirname}/receipts/${imgPath}`)
  const image = await jimpRead(imgBuffer)
  const qr = new QrCode()
  qr.callback = function (err, value) {
    if (err) {
      console.error('Error reading receipt', err)
      // TODO handle error
      return
    }
    const receipt = {
      img: imgPath,
      receipt: JSON.parse(value.result)
    }
    receipts.push(receipt)
    io.emit('receipt', receipt)
  }
  qr.decode(image.bitmap)
}

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
  .on('add', async function (path) {
    if (path.endsWith('.json')) {
      console.log('new receipt');
      const receiptName = path.replace(`${__dirname}/receipts/`, '').replace('.json', '')
      const receipt = readReceiptJson(receiptName)
      receipts.push(receipt)
      io.emit('receipt', receipt)
    }
  })
  .on('change', function (path) {
    console.log('File', path, 'has been changed')
  })
  .on('unlink', function (path) {
    console.log('File', path, 'has been removed')
  })
  .on('error', function (error) {
    console.error('Error happened', error)
  })

app.use(require('body-parser').json())
app.use(
  require('body-parser').urlencoded({
    extended: true
  })
)

app.get('/expenses', (_, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.get('/attestation', (_, res) => {
  res.sendFile(`${__dirname}/attestation.html`)
})

app.get('/report-receipt/:receiptName', async (req, res) => {
  const {
    receiptName
  } = req.params

  const digitalDeceipt = readReceiptJson(receiptName).receipt
  const {
    receipt
  } = digitalDeceipt

  const html = `
    <!DOCTYPE html>
    <html>
      <head></head>
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
          receipt.date
        ).format('YYYY-MM-DD')}'/>

        <label for="id_amount">Belopp</label>
        <input id="id_amount" type="text" name="amount" readonly="readonly" value='${
          receipt.amount
        }'/>

        <label for="id_vat">Moms</label>
        <input id="id_vat" type="text" name="vat" readonly="readonly" value='${
          receipt.vat
        }'/>

        <input type="hidden" id="id_organizationId" name="organizationId" value='${
          receipt.organizationId
        }'/>

        <input type="submit" value="Spara"/>
        <input type="button" value="Tillbaka" onclick="location.href='/expenses';"/>
        </form>
      </body>
    </html>
    `
  res.send(html)
})

function setReceiptAsSaved(hash) {
  receipts = receipts
    .map(r => ({
      ...r,
      receipt: {
        ...r.receipt,
        saved: r.receipt.hash === hash || r.receipt.saved
      }
    }))
  receipts
    .forEach(r => {
      if (r.receipt.hash === hash) {
        fs.writeFileSync(`${__dirname}/receipts/${r.img.replace('.png', '.json')}`,
          JSON.stringify(r.receipt)
        )
      }
    })
}

function setReceiptAsNotSaved(hash) {
  receipts = receipts
    .map(r => {
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
  receipts
    .forEach(r => {
      if (r.receipt.hash === hash) {
        fs.writeFileSync(`${__dirname}/receipts/${r.img.replace('.png', '.json')}`,
          JSON.stringify(r.receipt)
        )
      }
    })
}

app.post('/report-receipt/:hash', async (req, res) => {
  const {
    hash
  } = req.params
  try {
    await got(`${process.env.HASH_REGISTRY_URL}/use-receipt`, {
      method: 'POST',
      json: true,
      body: {
        receipt: {
          hash,
          reporterOrgId: USER_ACCOUNTING_ORG_ID
        }
      }
    })
  } catch (error) {
    setReceiptAsNotSaved(hash)
    return res.redirect(`/expenses?error=${error.body ? error.body : error}`)
  }

  setReceiptAsSaved(hash)
  res.redirect('/expenses?success=true')
})

app.use(express.static('receipts'))
app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use(express.static('partials'))

http.listen(port, () => console.log(`User accounting running on ${port}!`))

io.on('connection', socket => {
  console.log('a socket connected!')
  socket.emit('receipts', receipts)
})