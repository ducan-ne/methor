function test(req, res) {
  res.end('ok')
}

test.validate = [
  {
    type: Number,
    name: 'num'
  }
]

module.exports = test
