'use strict'

import finalhandler from 'finalhandler'

export default function(server, port) {
  if (!this.isNumber(port) && !this.isNull(port))
    throw new TypeError('Invalid port')

  this.$options.port = port
  server.on('request', (req, res) => {
    this(req, res, finalhandler(req, res))
  })

  return this
}
