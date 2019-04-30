function createHash(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

module.exports = {
  createHash
}
