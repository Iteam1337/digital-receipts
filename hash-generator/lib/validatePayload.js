function validatePayload (body) {
  if (!body || !Object.keys(body).length) {
    throw new Error('empty payload')
  }

  return true
}

module.exports = validatePayload