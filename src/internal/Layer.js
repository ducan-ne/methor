/*!
 * router
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 * @flow
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

import pathRegexp from 'path-to-regexp'
import type { HttpRequest, HttpResponse } from '../types'
import Route from './route'

const hasOwnProperty = Object.prototype.hasOwnProperty

export default class Layer {
  handle: Function
  name: string
  params: { [key: string]: any } | void
  path: string | void
  regexp: any
  keys: Array<string>
  route: Route | void
  method: string | void
  //  handleRequest(): void;//prettier-ignore

  constructor(path: string, options: Object, fn: Function) {
    const opts = options || {}

    this.handle = fn
    this.name = fn.name || '<anonymous>'
    this.params = undefined
    this.path = undefined
    this.keys = []
    this.regexp = pathRegexp(path, this.keys, opts)

    // set fast path flags
    this.regexp.fast_star = path === '*'
    this.regexp.fast_slash = path === '/' && opts.end === false
  }

  handleRequest(req: HttpRequest, res: HttpResponse, next: Function): void {
    let fn = this.handle
    if (fn.length > 3) {
      // not a standard request handler
      return next()
    }

    try {
      fn(req, res, next)
    } catch (err) {
      // catching "throw new Error"
      next(err)
    }
  }

  match(path: any) {
    let match: Array<any> | void

    if (path != null) {
      // fast path non-ending match for / (any path matches)
      if (this.regexp.fast_slash) {
        this.params = {}
        this.path = ''
        return true
      }

      // fast path for * (everything matched in a param)
      if (this.regexp.fast_star) {
        this.params = { '0': decodeParam(path) }
        this.path = path
        return true
      }

      // match the path
      match = this.regexp.exec(path)
    }

    if (!match) {
      this.params = undefined
      this.path = undefined
      return false
    }

    // store values
    this.params = {}
    this.path = match[0]

    // iterate matches
    let keys = this.keys
    let params = this.params

    for (let i = 1; i < match.length; i++) {
      let key = keys[i - 1]
      // $flow-disable-line
      let prop = key.name
      let val = decodeParam(match[i])

      if (val !== undefined || !hasOwnProperty.call(params, prop)) {
        params[prop] = val
      }
    }

    return true
  }
}

function decodeParam(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val
  }

  try {
    return decodeURIComponent(val)
  } catch (err) {
    if (err instanceof URIError) {
      err.message = "Failed to decode param '" + val + "'"
      err.status = 400
    }

    throw err
  }
}
