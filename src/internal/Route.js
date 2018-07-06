/*!
 * router
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 * @flow
 */

'use strict'
import Layer from './layer'
import methods from 'methods'

import type { HttpResponse, HttpRequest } from '../types'

import * as util from '../util'

export default class Route {
  stack: Array<Layer>
  path: string
  methods: { [key: string]: boolean }

  constructor(path: string): void {
    this.path = path
    this.stack = []

    this.methods = {}
  }

  _handles_method(method: string): boolean {
    if (this.methods._all) {
      return true
    }

    // normalize name
    let name = method.toLowerCase()

    if (name === 'head' && !this.methods['head']) {
      name = 'get'
    }

    return Boolean(this.methods[name])
  }

  _methods() {
    let methods: Array<string> = Object.keys(this.methods)

    // append automatic head
    if (this.methods.get && !this.methods.head) {
      methods.push('head')
    }

    // $flow-disable-line
    for (let i in methods) {
      methods[i] = methods[i].toUpperCase()
    }

    return methods
  }

  dispatch(req: HttpRequest, res: HttpResponse, done: Function): void {
    let idx = 0
    let stack = this.stack
    if (stack.length === 0) {
      return done()
    }

    let method = req.method.toLowerCase()
    if (method === 'head' && !this.methods['head']) {
      method = 'get'
    }

    req.route = this

    next()

    function next(err) {
      // signal to exit route
      if (err && err === 'route') {
        return done()
      }

      // signal to exit router
      if (err && err === 'router') {
        return done(err)
      }

      // no more matching layers
      if (idx >= stack.length) {
        return done(err)
      }

      let layer: Layer
      let match

      // find next matching layer
      while (match !== true && idx < stack.length) {
        layer = stack[idx++]
        match = !layer.method || layer.method === method
      }

      // no match
      if (match !== true) {
        return done(err)
      }
      if (err) {
        throw err
      } else {
        // $flow-disable-line
        layer.handleRequest(req, res, next)
      }
    }
  }

  all(...args: Array<Function>): void {
    const callbacks = util.flatten(args)

    if (callbacks.length === 0) {
      throw new TypeError('argument handler is required')
    }

    for (const fn of callbacks) {
      if (!util.isFunction(fn)) {
        throw new TypeError('argument handler must be a function')
      }

      const layer = new Layer('/', {}, fn)
      layer.method = undefined

      this.methods._all = true
      this.stack.push(layer)
    }

    // $flow-disable-line
    return this
  }
}

for (let method of methods) {
  // $flow-disable-line
  Route.prototype[method] = function(...args) {
    let callbacks = util.flatten(args)

    if (callbacks.length === 0) {
      throw new TypeError('argument handler is required')
    }

    for (let fn of callbacks) {
      if (!util.isFunction(fn)) {
        throw new TypeError('argument handler must be a function')
      }

      let layer = new Layer('/', {}, fn)
      layer.method = method

      this.methods[method] = true
      this.stack.push(layer)
    }

    return this
  }
}
