const express = require('express')
const app = express()

const port = 6900

app.use(require('body-parser').json())

app.get('/', (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <ul style="list-style-type: none;">
          <li style="display: inline;"><iframe src="http://localhost:9000" width="500" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="http://localhost:7900/emails" width="992" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="http://localhost:8900/expenses" width="992" height="1500"></iframe></li>
          <li style="display: inline;"><iframe src="http://localhost:5500/receipts" width="500" height="1500"></iframe></li>
          <li style="display: inline;"><iframe src="http://localhost:5700" width="500" height="1500"></iframe></li>
        </ul>
      </body>
    </html>
  `)
})

app.listen(port, () => console.log(`Everything running on ${port}!`))
