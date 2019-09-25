const r = require('rethinkdbdash')({
  host: process.env.CA_DB_HOST || 'localhost',
  port: process.env.CA_DB_PORT || 28015,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter
const jwt = require('jsonwebtoken')
const { kid, privateKey } = require('./keyProvider')

async function enrollPublisher(req, res) {
  const { organizationId } = req.body
  let keys
  try {
    keys = JSON.parse(req.body.keys)
  } catch (ex) {
    return res.redirect('/enroll?success=false')
  }

  const results = await r.table('keys').filter({
    organizationId
  })

  if (!results.length) {
    const token = jwt.sign(
      {
        keys: keys.map(({ kid }) => kid)
      },
      privateKey,
      {
        algorithm: 'RS256',
        keyid: kid
      }
    )

    res.cookie('publisherKeyToken', token)

    await Promise.all(
      keys.map(async ({ publicKey, privateKey, kid }) => {
        await r.table('keys').insert({
          key: publicKey,
          kid,
          type: 'publisher'
        })

        await r.table('private_keys_for_poc').insert({
          publicKey,
          privateKey,
          kid,
          token
        })
      })
    )

    await r.table('companies').insert({
      organizationId,
      keys: keys.length
    })

    return res.redirect(`/enroll?success=true&token=${token}`)
  }

  return res.redirect('/enroll?success=false')
}

async function enrollReporter(req, res) {
  const { organizationId } = req.body
  let keys
  try {
    keys = JSON.parse(req.body.keys)
  } catch (ex) {
    return res.redirect('/enroll?success=false')
  }

  const results = await r.table('keys').filter({
    organizationId
  })

  if (!results.length) {
    const token = jwt.sign(
      {
        keys: keys.map(({ kid }) => kid)
      },
      privateKey,
      {
        algorithm: 'RS256',
        keyid: kid
      }
    )

    res.cookie('reporterKeyToken', token)

    await Promise.all(
      keys.map(async ({ publicKey, privateKey, kid }) => {
        await r.table('keys').insert({
          key: publicKey,
          kid,
          type: 'reporter'
        })

        await r.table('private_keys_for_poc').insert({
          publicKey,
          privateKey,
          kid,
          token
        })
      })
    )

    await r.table('companies').insert({
      organizationId,
      keys: keys.length
    })

    return res.redirect(`/enroll?success=true&token=${token}`)
  }

  return res.redirect('/enroll?success=false')
}

module.exports = {
  enrollPublisher,
  enrollReporter
}
