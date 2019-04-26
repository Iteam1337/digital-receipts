const express = require('express')
const app = express()

const port = 5500
const receipts = []

function validateNotDuplicate(receipt) {
    // receipts.
}


app.use(require('body-parser').json())

app.post('/receipts', (req, res) => {
    const {
        receipt
    } = req.body

    receipts.push(receipt)
    res.send({
        id: Date.now()
    })
})

app.get('/receipts', (req, res) => {
    res.send(receipts)
})

app.listen(port, () => {
    console.log('Hash-registry running on ', port)
})