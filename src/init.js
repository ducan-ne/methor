'use strict'

import { Server, METHODS } from 'http'
import {
	isArray,
	identity,
	isObject,
	bind,
	isFunction,
	isUndef,
	isNumber,
	cleanPath,
	isString
} from './util'
import Router from 'router'
import methods from 'methods'
import bodyParser from 'body-parser'

export default function Init() {
	const opts = this.opts
	const router = opts.router || Router()
	const server = opts.server || new Server()
	const parseBodyJson = bodyParser.json()
	const parseBodyFormData = bodyParser.urlencoded({ extended: false })

	if (!(server instanceof Server))
		throw new TypeError('options.server must be abstract of http.Server')

	this.router = router
	this.server = server

	let self = this

	this.proxy = new Proxy(this, {
		get(target, name, _) {
			if (name in target) return target[name]
			if (self.server && name in self.server) {
				if (isFunction(self.server[name])) {
					return function(...args) {
						self.server[name](...args)
						return target
					}
				}
				return self.server[name]
			}
			return
		}
	})

	if (isObject(opts.services)) {
		this.services = opts.services
	}

	for (let k of methods.concat('all')) {
		if (isFunction(this.router[k])) {
			this[k] = this.router[k].bind(router)
		}
	}

	router.use(this.middleware)

	// --- BODY PARSE ---
	router.use((req, res, next) => {
		if (isUndef(req.body)) {
			parseBodyJson(req, res, next)
		} else {
			next()
		}
	})
	router.use((req, res, next) => {
		if (isUndef(req.body)) {
			parseBodyFormData(req, res, next)
		} else {
			next()
		}
	})
	// --- END BODY PARSE ---

	if (isArray(opts.middlewares)) {
		for (let mid of opts.middlewares) {
			router.use(mid)
		}
	}

	if (isString(opts.static)) {
		try {
			const serveStatic = require('serve-static')
			router.use(serveStatic(opts.static))
		} catch (err) {
			throw new TypeError(
				'you must install "serve-static" to your dependencies'
			)
		}
	}

	if (isObject(opts.routes) || isArray(opts.routes)) {
		let routes = opts.routes
		for (let index in routes) {
			if (isNumber(index)) {
				this.addRoute(routes[index])
			} else {
				this.addRoute(routes[index], index)
			}
		}
	}

	const beforeEnter = [...this._beforeEnter, this.opts.beforeEnter].filter(
		identity
	) // remove if opt.beforeEnter is undefined, bind method

	const restserverPath = this.opts._restserverPath

	router.all(
		isString(restserverPath) ? restserverPath : '/restserver',
		...beforeEnter,
		this.restserver.bind(this)
	)

	return this.proxy

}
