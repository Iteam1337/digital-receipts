function validatePayload (body) {
  if (!body || !Object.keys(body).length) {
    throw new Error('empty payload')
  }

  const errors = []
  Object.keys(body).forEach(key => {
    if (!body[key]) {
      errors.push(key)
    }
  })

  if(errors.length) {
    throw new Error(`Missing fields: ${[...errors]}`)
  }

  return true
}

module.exports = validatePayload