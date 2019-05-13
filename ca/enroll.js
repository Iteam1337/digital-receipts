const r = require('rethinkdbdash')({
  port: 28016,
  db: 'ca'
}) // TODO remove rethinkdb or move to adapter

async function enroll(req, res) {
  console.log('ennrr', req.body);
  console.log('ennrr', req.body.publisherOrganizationId);

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
      organizationId: publisherOrganizationId
    })
    return res.redirect('/enroll?success=true')
  }

  return res.redirect('/enroll?success=false')
}

module.exports = enroll