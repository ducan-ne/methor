'use strict'

import regeneratorRuntime from 'regenerator-runtime'

import { createServer, Server } from 'http'
import chalk from 'chalk'
import {
	isFunction,
	isObject,
	isArray,
	isNumber,
	isPromise,
	isString,
	getProperty,
	getAllKeys,
	capitalize
} from './util'
import * as util from './util'
import Router from 'router'

import Init from './init'
import Listen from './listen'
import addRoute from './add-route'
import Middleware from './middleware'
import Restserver from './restserver'

import { resolve } from 'path'

function Methor(opts) {
	if (!(this instanceof Methor)) return new Methor(opts)

	if (!opts) throw new TypeError('1 argument required, but only 0 present.')
	if (!isObject(opts)) throw new TypeError('argument options must be object')

	const methods = opts.methods

	if (!methods) throw new TypeError('option methods is required')
	if (!(isFunction(methods) || isObject(methods)))
		throw new TypeError('option methods must be a function or object ')

	if (!opts.port) throw new TypeError('option port is required')
	if (!isNumber(opts.port)) throw new TypeError('option port must be number')

	this.opts = opts
	this.methods = getAllKeys(methods).reduce((obj, methodName) => {
		obj[methodName] = getProperty(methods, methodName)
		return obj
	}, {})

	if (opts.funcs) {
		if (!isObject(opts.funcs))
			throw new TypeError('option funcs must be object')
		this.funcs = opts.funcs
	}

	this.$on = function(name, cb) {
		return this.proxy.on(name, cb)
	}
	this.$emit = function(name, ...data) {
		return this.proxy.emit(name, ...data)
	}

	this._beforeEnter = []
	this._installed = []
	this.services = {}

	// Server.call(this)

	this.installPlugin()

	this.init()
	this.listen()

	return this
}

// Methor.prototype = Object.create(Server.prototype)
Methor.prototype.constructor = Server

Methor.prototype.init = Init
Methor.prototype.listen = Listen
Methor.prototype.middleware = Middleware
Methor.prototype.addRoute = addRoute
Methor.prototype.restserver = Restserver

Methor.prototype.beforeEnter = function(...callbacks) {
	if (callbacks.length == 0) throw new TypeError('argument handler is required')
	for (let callback of callbacks) {
		if (!isFunction(callback))
			throw new TypeError('argument handler must be function')
	}
	this._beforeEnter = [...this._beforeEnter, ...callbacks]
	return this
}

Methor.prototype.handlerResponse = async function(req, res, _, result) {
	if (isPromise(result)) result = await result
	if (res.finished) return false
	if (result == undefined || result == null) return res.end('')
	if (isString(result) || isNumber(result)) return res.end(String(result))
	if (isObject(result)) return res.json(result)
	res.end(result.toString())
}

Methor.prototype.warn = function(msg, plugin) {
	if (process.env.NODE_ENV != 'development') {
		console.warn(
			chalk.yellow('[') +
				' Methor ' +
				chalk.yellow.bold('warning') +
				' ' +
				(plugin ? 'from ' + chalk.red.bold(plugin) : '') +
				chalk.yellow(' ]') +
				' ' +
				msg
		)
	}
}

Methor.prototype.installPlugin = function() {
	const plugins = this.opts.plugins
	if (!plugins) return
	const _installed = this._installed
	for (const plugin of plugins) {
		if (_installed.includes(plugin)) continue

		_installed.push(plugin)

		// const args = [...arguments].slice(1)
		if (isFunction(plugin.install)) {
			plugin.install.apply(this, [])
		} else if (isFunction(plugin)) {
			plugin.apply(this, [])
		}
	}
}

for (let key in util) {
	Methor.prototype[key] = util[key]
}

;['validator'].map(name => {
	Object.defineProperty(Methor, capitalize(name), {
		get() {
			return require(resolve(__dirname, 'plugins', name)).default
		}
	})
})

module.exports = Methor
