/*!
 * router
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

import pathRegexp from 'path-to-regexp'

const hasOwnProperty = Object.prototype.hasOwnProperty

export default class Layer {
  constructor(path, options, fn) {
    const opts = options || {}

    this.handle = fn
    this.name = fn.name || '<anonymous>'
    this.params = undefined
    this.path = undefined
    this.regexp = pathRegexp(path, (this.keys = []), opts)

    // set fast path flags
    this.regexp.fast_star = path === '*'
    this.regexp.fast_slash = path === '/' && opts.end === false
  }

  handleRequest(req, res, next) {
    var fn = this.handle

    if (fn.length > 3) {
      // not a standard request handler
      return next()
    }

    try {
      fn(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  match(path) {
    var match

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
    var keys = this.keys
    var params = this.params

    for (var i = 1; i < match.length; i++) {
      var key = keys[i - 1]
      var prop = key.name
      var val = decodeParam(match[i])

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
