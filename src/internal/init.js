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

  this.middleware(Middleware)

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
    defer(() => {
      this.listen(opts.port)
    })
  }
}
