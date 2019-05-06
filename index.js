const express = require('express')
const app = express()

const port = 6900

require('dotenv').config()

app.use(require('body-parser').json())

app.get('/', (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <ul style="list-style-type: none;">
          <li style="display: inline;"><iframe src="${process.env.SHOP_URL}" width="500" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.MAIL_URL}/emails" width="992" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.USER_ACCOUNTING_URL}/expenses" width="992" height="1500"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.HASH_REGISTRY_URL}/receipts" width="500" height="1500"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.CA_URL}" width="500" height="1500"></iframe></li>
        </ul>
      </body>
    </html>
  `)
})

app.listen(port, () => console.log(`Everything running on ${port}!`))