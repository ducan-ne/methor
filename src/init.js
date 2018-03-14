'use strict'

const { createServer, Server } = require('http')
const { isArray, identity, isObject, bind } = require('./util')
const Router = require('router')
const finalhandler = require('finalhandler')

module.exports = Init

function Init() {
	const opts = this.opts
	const server = opts.server || createServer()
	const router = opts.router || Router()

	if (!(server instanceof Server))
		throw new TypeError('option server must be abstract of http.Server')

	this.server = server
	this.router = router

	router.use(this.middleware)

	if (isArray(opts.middlewares)) {
		for (let mid of opts.middlewares) {
			router.use(mid)
		}
	}
	if (isObject(opts.routes)) {
		let routes = opts.routes
		for (let path in routes) {
			let callbacks = isObject(routes[path]) ? routes[path] : [routes[path]]
			if (callbacks.length == 0)
				throw new TypeError('argument handler is required')

			// callbacks.map(cb => {
			//   cb = cb.bind(opts.funcs)
			// 	return cb
			// })

			router.get(
				path,
				...callbacks.map(cb => {
					return (...args) => {
						let result = bind(cb, opts.funcs, args)(...args)
            this.afterEnter(...args, result)
					}
				})
			)
		}
	}

	const beforeEnter = [this.opts.beforeEnter, ...this._beforeEnter].filter(
		identity
	)

	router.all(
		this.opts._restserverPath || '/restserver',
		...beforeEnter,
		(...args) => {
			const [req, res, next] = args
			const methodName = req.query.method
			const method = this.methods[methodName]

			if (!method) {
				this.warn(`method ${methodName} not exist`)
				return next()
			}

			let result = bind(method, opts.funcs, args)(...args)
      this.afterEnter(...args, result)
		}
	)

	server
		.listen(opts.port, () => {
			let info = {
				port: opts.port,
				server,
				router
			}
			opts.created && opts.created.bind(info)(info)
		})
		.on('request', (req, res) => {
			router(req, res, finalhandler(req, res))
		})
}
