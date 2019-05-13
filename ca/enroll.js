const r = require('rethinkdbdash')({
  port: 28016,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter

async function enrollPublisher(req, res) {
  const { endpoint, organizationId } = req.body
  const results = await r.table('keys').filter({
    organizationId
  })

  if (!results.length) {
    await r.table('keys').insert({
      endpoint,
      organizationId,
      type: 'publisher'
    })
    return res.redirect('/enroll?success=true')
  }

  return res.redirect('/enroll?success=false')
}

async function enrollReporter(req, res) {
  const { endpoint, organizationId } = req.body
  const results = await r.table('keys').filter({
    organizationId
  })

  if (!results.length) {
    await r.table('keys').insert({
      endpoint,
      organizationId,
      type: 'reporter'
    })
    return res.redirect('/enroll?success=true')
  }

  return res.redirect('/enroll?success=false')
}

module.exports = {
  enrollPublisher,
  enrollReporter
}
