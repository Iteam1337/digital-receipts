const r = require('rethinkdbdash')({
  port: 28016,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter

async function enrollPublisher(req, res) {
  const {
    publisherEndpoint,
    publisherOrganizationId
  } = req.body
  const results = await r.table('keys').filter({
    organizationId: publisherOrganizationId
  })

  if (!results.length) {
    const result = await r.table('keys').insert({
      publisherEndpoint,
      organizationId: publisherOrganizationId,
      type: 'publisher'
    })
    return res.redirect('/enroll?success=true')
  }

  return res.redirect('/enroll?success=false')
}

async function enrollReporter(req, res) {
  const {
    publisherEndpoint,
    publisherOrganizationId
  } = req.body
  const results = await r.table('keys').filter({
    organizationId: publisherOrganizationId
  })

  if (!results.length) {
    const result = await r.table('keys').insert({
      publisherEndpoint,
      organizationId: publisherOrganizationId,
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