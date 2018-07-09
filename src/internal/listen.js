// @flow

import finalhandler from 'finalhandler'
import http from 'http'
import { Server } from 'http'

export default function Listen(
  port: number,
  fn: Function,
  server: Server
): void {
  const { $options: opts, isFunction } = this
  if (!server) {
    server = http.createServer((req, res) => {
      this(req, res, finalhandler(req, res))
    })
  }

  this.__server = server

  server.listen(port, () => {
    const port = server.address().port
    this.port = port
    this.$options.port = port
    if (isFunction(opts.created)) {
      opts.created.call(this, port, server)
      this.$emit('server.created', port, server)
      // this.$emit('server-created', port, server)
      isFunction(fn) && fn(port)
    }
  })
}
