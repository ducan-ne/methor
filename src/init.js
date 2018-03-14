'use strict'

const { Server, METHODS } = require('http')
const { isArray, identity, isObject, bind, isFunction } = require('./util')
const Router = require('router')
const finalhandler = require('finalhandler')
const methods = require('methods')

module.exports = Init

function Init() {
	const opts = this.opts
	const router = opts.router || Router()
	const server = opts.server || new Server()

	this.router = router
	this.server = server

	for (let k of methods.concat('all')) {
		if (isFunction(this.router[k])) {
			this[k] = this.router[k].bind(router)
		}
	}
	this.proxy = new Proxy(this, {
		get(target, name, _) {
			if (name in target) return target[name]
			if (name in server) {
				if (isFunction(server[name])) {
					return function(...args) {
						server[name](...args)
						return target
					}
				}
				return server[name]
			}
			return;
		}
	})


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
				router,
				server
			}
			opts.created && opts.created.bind(info)(info)
		})
		.on('request', (req, res) => {
			router(req, res, finalhandler(req, res))
		})
	return this
}
