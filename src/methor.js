'use strict'

const { createServer, Server } = require('http')
const {
	isFunction,
	isObject,
	isArray,
	isNumber,
  isPromise,
  isString,
	getProperty,
	getAllKeys
} = require('./util')
const Router = require('router')

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
		return this.on(name, cb)
	}
	this.$emit = function(name, ...data) {
		return this.emit(name, ...data)
	}

	this._beforeEnter = []

	// Server.call(this)

	this.init()


	return this.proxy
}

// Methor.prototype = Object.create(Server.prototype)
Methor.prototype.constructor = Server

Methor.prototype.init = require('./init')
Methor.prototype.middleware = require('./middleware')
Methor.prototype.addRoute = require('./add-route')

Methor.prototype.beforeEnter = function(...callbacks) {
	if (callbacks.length == 0) throw new TypeError('argument handler is required')
	for (let callback of callbacks) {
		if (!isFunction(callback))
			throw new TypeError('argument handler must be function')
	}
	this._beforeEnter = callbacks
	return this
}
Methor.prototype.afterEnter = async function(req, res, _, result) {
  if (isPromise(result)) result = await result
  if (result == undefined || result == null) return
  if (isString(result) || isNumber(result))
    return res.end(String(result))
  if (isObject(result))
    return res.json(result)
  res.end(result)
}

Methor.prototype.warn = function(msg) {
	if (process.env.NODE_ENV != 'development') {
		console.warn('[ methor ] ' + msg)
	}
}

module.exports = Methor
