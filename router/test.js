'use strict'

const fn = require('finalhandler')

const app = require('./index')()
//
// app.use(function onEnter(req, res, next) {
//   next()
// })

app.get('/', (req, res) => {
  console.log(123)
})

// require('http')
//   .createServer((req, res) => {
//     app(req, res, fn(req, res))
//   })
//   .listen(3324, console.log.bind(console, 'ok'))
