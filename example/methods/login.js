'use strict'

module.exports = ['req[headers][cookie]', 'res', (req, res, headers) => {
  return new Promise(resolve => {
    // --- FAKE LOGIN ---
    setTimeout(() => {
      resolve('user login')
    }, 1e3)
  })
}]

module.exports.validate = [{
  type: String,
  name: 'username'
}]
