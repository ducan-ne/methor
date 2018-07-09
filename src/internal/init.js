'use strict'

// import { Server, METHODS } from 'http'
import {
  isArray,
  identity,
  isObject,
  bind,
  isFunction,
  isUndef,
  isNull,
  isNumber,
  cleanPath,
  isString,
  defer
} from '../util'
import bodyParser from 'body-parser'
import Middleware from '../middleware'

export default function Init() {
  const opts = this.$options
  const parseBodyJson = bodyParser.json()
  const parseBodyFormData = bodyParser.urlencoded({ extended: false })

  if (isObject(opts.services)) {
    this.services = opts.services
  }

  this.middleware((req, res, next) => {
    Middleware.call(this, req, res, next)
  }) // keep "this"

  if (isArray(opts.middlewares)) {
    for (let mid of opts.middlewares) {
      this.middleware(mid)
    }
  }

  // --- BODY PARSE ---
  this.middleware((req, res, next) => {
    if (isUndef(req.body)) {
      parseBodyJson(req, res, next)
    } else {
      next()
    }
  })
  this.middleware((req, res, next) => {
    if (isUndef(req.body)) {
      parseBodyFormData(req, res, next)
    } else {
      next()
    }
  })
  // --- END BODY PARSE ---

  if (isString(opts.static)) {
    try {
      const serveStatic = require('serve-static')
      this.middleware(serveStatic(opts.static))
    } catch (err) {
      throw new TypeError(
        'you must install "serve-static" to your dependencies'
      )
    }
  }

  this.middleware((req, res, next) => {
    const query = req.query
    const body = req.body
    const { isFunction, isString, $options: opts } = this

    let methodName

    if (isString(opts.resolveMethod)) {
      if (opts.resolveMethod === 'req.body') {
        methodName = body.method
      }
      if (opts.resolveMethod === 'req.headers') {
        methodName = req.headers['method']
      }
    } else if (isFunction(opts.resolveMethod)) {
      methodName = opts.resolveMethod(req, res)
    }

    if (!methodName) {
      methodName = query.method
    }

    req.methodName = methodName
    req._method = this.methods[methodName]

    req.class = query.method ? query.method.split('.')[0] : false
    next()
  })

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

  if (isNumber(opts.port) || isNull(opts.port)) {
    // defer(() => {
    this.listen(opts.port)
    // })
  }
}
