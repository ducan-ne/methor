// @flow

import regeneratorRuntime from 'regenerator-runtime'

type ancms = {
  addRoute: string
}

import { Server } from 'http'
import chalk from 'chalk'
import {
  isFunction,
  isObject,
  isArray,
  isNumber,
  isPromise,
  isString,
  getProperty,
  getAllMethod,
  capitalize,
  setPropertyOf,
  isNull,
  flatten
} from './util'
import * as util from './util'
import Router from 'router'
import methods from 'methods'

import Route from './internal/Route'
import Layer from './internal/Layer'

import Init from './internal/Init'
import Listen from './internal/Listen'
import Mount from './internal/Mount'
import addRoute from './internal/AddRoute'
import Handler from './internal/Handler'
import LodashSet from 'lodash.set'

import Restserver from './restserver'

import { resolve } from 'path'
import events from 'events'

function Methor(opts: Object): Methor {
  if (!(this instanceof Methor)) {
    return new Methor(opts)
  }

  if (!opts) {
    throw new TypeError('1 argument required, but only 0 present.')
  }
  if (!isObject(opts)) {
    throw new TypeError('argument options must be object')
  }

  const methods = opts.methods

  if (!methods) throw new TypeError('option methods is required')
  if (!(isFunction(methods) || isObject(methods)))
    throw new TypeError('option methods must be a function or object ')

  // if (!opts.port) throw new TypeError('option port is required')
  // if (!isNumber(opts.port)) throw new TypeError('option port must be number')

  this.$options = opts
  this.methods = getAllMethod(methods)

  if (opts.funcs) {
    if (!isObject(opts.funcs))
      throw new TypeError('option funcs must be object')
    this.funcs = opts.funcs
  }

  // --- private property ---
  this.restserver = Restserver
  this.addRoute = addRoute
  this.$mount = Mount

  this._beforeEnter = []
  this._installed = []
  this.services = {}

  // Server.call(this)

  this.installPlugin()

  function methor(req, res, next) {
    methor.handler(req, res, next)
  }
  setPropertyOf(methor, this)

  const event = new events.EventEmitter()
  methor.$on = event.on
  methor.$off = event.removeListener
  methor.$emit = event.emit
  methor.$removeAllListeners = event.removeAllListeners

  methor.stack = []
  methor.params = {}

  methor.init()

  return methor
}

Methor.prototype = function() {}

// Methor.prototype = Object.create(Server.prototype)
Methor.prototype.constructor = Server

Methor.prototype.handler = Handler
Methor.prototype.init = Init
Methor.prototype.listen = Listen
Methor.prototype.BetterHandler = require('./internal/BetterHandler').default

Methor.prototype.beforeEnter = function beforeEnter(...callbacks) {
  if (callbacks.length == 0) {
    throw new TypeError('argument handler is required')
  }
  for (let callback of callbacks) {
    if (!isFunction(callback))
      throw new TypeError('argument handler must be function')
  }
  this._beforeEnter = [...this._beforeEnter, ...callbacks]
  return this
}

Methor.prototype.handlerResponse = async function handlerResponse(
  req,
  res,
  result
) {
  if (isPromise(result)) {
    result = await result
  }

  if (res.finished) {
    return false
  }

  if (result == undefined || result == null) {
    return res.end('')
  }

  if (isString(result) || isNumber(result)) {
    return res.end(String(result))
  }

  if (isObject(result) || isArray(result)) {
    return res.json(result)
  }
  res.end(result.toString())
}

Methor.prototype.warn = function warn(msg, plugin) {
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

Methor.prototype.$route = function $route(path) {
  const opts = this.$options
  const route = new Route(path)

  const layer = new Layer(
    path,
    {
      sensitive: opts.caseSensitive,
      strict: opts.strict,
      end: true
    },
    handle
  )

  function handle(req, res, next) {
    route.dispatch(req, res, next)
  }

  layer.route = route
  this.stack.push(layer)
  return route
}

Methor.prototype.middleware = function use(handler) {
  let offset = 0
  let path = '/'

  if (!isFunction(handler)) {
    offset = 1
    path = handler
  }

  const callbacks = flatten([].slice.call(arguments, offset))

  if (callbacks.length === 0) {
    throw new TypeError('argument handler is required')
  }

  for (let fn of callbacks) {
    if (!isFunction(fn)) {
      throw new TypeError('argument handler must be a function')
    }

    const layer = new Layer(
      path,
      {
        sensitive: this.$options.caseSensitive,
        strict: false,
        end: false
      },
      fn
    )

    layer.route = undefined

    this.stack.push(layer)
  }

  return this
}

methods.concat('all').forEach(function(method) {
  Methor.prototype[method] = function(path, ...args) {
    var route = this.$route(path)
    route[method].apply(route, args)
    return this
  }
})

Methor.prototype.installPlugin = function() {
  const plugins = this.$options.plugins
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

Methor.prototype.$option = function setOption(k, value) {
  LodashSet(this.$options, k, value)
  return this
}

for (let key in util) {
  Methor.prototype[key] = Methor[key] = util[key]
}

;['validator'].map(name => {
  Object.defineProperty(Methor, capitalize(name), {
    get() {
      let pathname = resolve(__dirname, 'plugins', name)
      // $flow-disable-line
      return require(pathname).default
    }
  })
})

module.exports = Methor
