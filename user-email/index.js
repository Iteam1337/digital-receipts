const express = require('express')
const app = express()
const port = 7900
const moment = require('moment')
const staticMails = require('./assets/staticMails')
const qrcode = require('qrcode')

app.use(require('body-parser').json())
let receipts = []

function newReceipt(r) {
  return `
    <tr onclick='openReceipt(${JSON.stringify(r)})'>
        <td><input type="checkbox"/></td>
        <td><strong>${r.receipt.shopName}</strong></td>
        <td>Lorem ipsum dolor sit amet</td>
        <td>${r.date}</td>
    </tr>`
}

function openReceipt(r) {
  const {
    receipt
  } = r
  const receiptJson = JSON.stringify(r)
  const receiptHtml = `
        <h2>${receipt.shopName}</h2>
        <ul>
            ${Object.keys(receipt)
              .map(k => {
                return `<li>${k} : ${receipt[k]}</li>`
              })
              .join('')}
        </ul>
        <pre>${JSON.stringify(r, null, 2)}</pre>
        <canvas id="canvas"></canvas>
        <input style="display: block;" type="button" value="Ladda ner" onclick='downloadReceipt(${receiptJson})'/>
        <br/>
        <ul class="email-actions">
            <li><input type="button" value="Reply"/></li>
            <li><input type="button" value="Reply all"/></li>
            <li><input type="button" value="Forward" onclick='forwardReceipt(${receiptJson})'/></li>
        </ul>
    `
  document.getElementById('email-container').innerHTML = receiptHtml
  QRCode.toCanvas(document.getElementById('canvas'), receiptJson)
}

function forwardReceipt(r) {
  const result = prompt('To', 'kvitton@ekonomi.se')
  if (result) {
    fetch('/forward', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(r)
    })
  }
}

app.post('/emails', (req, res) => {
  receipts.push({
    ...req.body,
    date: moment().format('HH:MM')
  })
  res.sendStatus(200)
})
app.get('/emails', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <link rel="stylesheet" type="text/css" href="css.css"/>
            <script src="/qrcode/build/qrcode.min.js"></script>
        </head>
        <body>
            <input type="button" value="Refresh" onclick="location.href='/emails'"/>
            <table>
                <thead><h2>FakeMail</h2></thead>
                <tbody>
                ${receipts.map(newReceipt).join('')}
                ${staticMails}
            </tbody>
            </table>

            <div id="email-container"></div>
            <script type="text/javascript">
                var openReceipt = ${eval(openReceipt)}
                var forwardReceipt = ${eval(forwardReceipt)}
            </script>
        </body>
    </html>
    `)
})

app.post('/forward', (req, res) => {
  qrcode.toFile(
    `../user-accounting/receipts/receipt-${Date.now()}.png`,
    JSON.stringify(req.body)
  )
  res.sendStatus(200)
})

app.use(express.static('node_modules'))
app.use(express.static('public'))

app.listen(port, () => console.log(`User interface running on ${port}!`))