'use strict'

import finalhandler from 'finalhandler'
import http from 'http'

export default function Listen(port, fn, _server) {
  const { $options: opts, isFunction } = this
  const server =
    _server ||
    http.createServer((req, res) => {
      this(req, res, finalhandler(req, res))
    })

  server.listen(port, () => {
    const port = server.address().port
    this.port = port
    if (isFunction(opts.created)) {
      opts.created.call(this, port, server)
      this.$emit('server.created', port)
      isFunction(fn) && fn(port)
    }
  })
}
