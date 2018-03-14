'use strict'

module.exports = (req, res) => {
  return new Promise(resolve => {
    // --- FAKE LOGIN ---
    setTimeout(() => {
      resolve('user login')
    }, 1e3)
  })
}
