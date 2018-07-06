'use strict'

import finalhandler from 'finalhandler'
import { Server } from 'http'

export default function(server: Server, port: string): any {
  if (!this.isNumber(port) && !this.isNull(port))
    throw new TypeError('Invalid port')

  this.$options.port = port
  server.on('request', (req, res) => {
    this(req, res, finalhandler(req, res))
  })

  return this
}
