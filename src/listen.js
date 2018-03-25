'use strict'

import finalhandler from 'finalhandler'

export default function Listen() {
	const { opts, router, server } = this
	const args = [
		opts.port || process.env.PORT,
		() => {
			let info = {
				port: opts.port || server.address().port,
				router,
				server
			}
			opts.created && opts.created.bind(info)(info)
		}
	]
	if (!args[0]) {
		args.shift()
	}
	server.listen(...args).on('request', (req, res) => {
		router(req, res, finalhandler(req, res))
	})
}
