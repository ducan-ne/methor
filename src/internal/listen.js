'use strict'

import finalhandler from 'finalhandler'
import {Server} from 'http'

export default function Listen() {
	if (this.$server_listening) {
    throw new TypeError('cant call this method 2 times')
  }
	const { opts, router, server, isNull } = this
	const args = [
		opts.port || process.env.PORT,
		() => {
			let info = {
				port: (opts.port && !isNull(opts.port)) ? opts.port : server.address().port,
				router,
				server
			}
			opts.created && opts.created.bind(info)(info)
		}
	]
	if (!args[0] || args[0] == null) {
		args.shift()
	}

	if (!(server instanceof Server))
		throw new TypeError('options.server must be abstract of http.Server')

	this.$server_listening = true
	server.listen(...args).on('request', (req, res) => {
		router(req, res, finalhandler(req, res))
	})
}
