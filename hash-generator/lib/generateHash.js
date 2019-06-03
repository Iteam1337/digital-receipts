function generateHash (payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

module.exports = generateHash