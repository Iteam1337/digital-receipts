const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const port = 8900
const chokidar = require('chokidar')
const receipts = []
const QrCode = require('qrcode-reader')

const jimp = require('jimp')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const jimpRead = util.promisify(jimp.read)

const watcher = chokidar.watch(`${__dirname}/assets`, {
  ignored: /^\./,
  persistent: true
})

watcher
  .on('add', async function(path) {
    const imgPath = path.replace(`${__dirname}/assets`, '')
    const imgBuffer = await readFile(`${__dirname}/assets/${imgPath}`)
    const image = await jimpRead(imgBuffer)
    const qr = new QrCode()
    qr.callback = function(err, value) {
      if (err) {
        console.error(err)
        // TODO handle error
      }
      const receipt = {
        img: imgPath,
        receipt: value.result
      }
      receipts.push(receipt)
      io.emit('receipt', receipt)
    }
    qr.decode(image.bitmap)
  })
  .on('change', function(path) {
    console.log('File', path, 'has been changed')
  })
  .on('unlink', function(path) {
    console.log('File', path, 'has been removed')
  })
  .on('error', function(error) {
    console.error('Error happened', error)
  })

app.use(require('body-parser').json())

app.post('/emails', (req, res) => {
  receipts.push({
    ...req.body,
    date: moment().format('HH:MM')
  })
  res.sendStatus(200)
})

app.get('/expenses', (_, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.use(express.static('assets'))
app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use(express.static('partials'))

http.listen(port, () => console.log(`User accounting running on ${port}!`))

io.on('connection', socket => {
  console.log('a socket connected!')
  receipts.forEach(r => socket.emit('receipt', r))
})
