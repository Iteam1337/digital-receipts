const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = 8900
const chokidar = require('chokidar')
const receipts = []

const watcher = chokidar.watch(`${__dirname}/assets`, {
  ignored: /^\./,
  persistent: true
})

watcher
  .on('add', function(path) {
    receipts.push(path.replace(`${__dirname}/assets`, ''))
    io.emit('receipt', path.replace(`${__dirname}/assets`, ''))
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
