const express = require('express')
const app = express()
const port = 7900
const moment = require('moment')
app.use(require('body-parser').json())
const receipts = []


app.post('/receipts', (req, res) => {
    receipts.push({...req.body, date: moment().format('HH:MM') })
    res.sendStatus(200)
})
app.get('/receipts', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
        <body>
            <table>
                <thead><h2>FakeMail</h2></thead>
                <tbody>
                ${receipts.map(r => `<tr onclick="openReceipt(${r})"><td><input type="checkbox"/></td><td><strong>${r.receipt.shopName}</strong></td><td>Lorem ipsum dolor sit amet</td><td>${r.date}</td></tr>`).join('')}
                <tr>
                    <td><input type="checkbox"/></td>
                    <td><strong>Lottery.com </strong</td>
                    <td>
                        <span>&nbsp;&nbsp;</span>Join now and win $3000
                    </span>
                </td>
                <td>

                        4:11 PM

                </td>

                <tr>
                    <td><input type="checkbox"/></td>
                    <td><strong>Nordic JS</strong></td>
                    <td>
                        <span>&nbsp;&nbsp;</span>And only 50 Regular Bird Tickets left View this email in
                    your browser Today we're very excited to announce that Eva Ferreira (UI Developer at
                    Aerolab) and Vaide
                    </span>
                </td>
                <td>

                        1:28 PM

                </td>
            </tr>
            </tbody>
            <script type="text/javascript">

            </script>
        </table>
    </body>
    </html>
    `)
})

app.listen(port, () => console.log(`User interface running on ${port}!`))