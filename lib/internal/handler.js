'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = Handler

var _finalhandler = require('finalhandler')

var _finalhandler2 = _interopRequireDefault(_finalhandler)

var _util = require('../util')

var _parseurl = require('parseurl')

var _parseurl2 = _interopRequireDefault(_parseurl)

var _Route = require('./Route')

var _Route2 = _interopRequireDefault(_Route)

var _Layer = require('./Layer')

var _Layer2 = _interopRequireDefault(_Layer)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  } else {
    return Array.from(arr)
  }
}

function getProtohost(url) {
  if (typeof url !== 'string' || url.length === 0 || url[0] === '/') {
    return undefined
  }

  var searchIndex = url.indexOf('?')
  var pathLength = searchIndex !== -1 ? searchIndex : url.length
  var fqdnIndex = url.substr(0, pathLength).indexOf('://')

  return fqdnIndex !== -1
    ? url.substr(0, url.indexOf('/', 3 + fqdnIndex))
    : undefined
}

function restore(fn, obj) {
  var props = new Array(arguments.length - 2)
  var vals = new Array(arguments.length - 2)

  for (var i = 0; i < props.length; i++) {
    props[i] = arguments[i + 2]
    vals[i] = obj[props[i]]
  }

  return function() {
    // restore vals
    for (var i = 0; i < props.length; i++) {
      obj[props[i]] = vals[i]
    }

    return fn.apply(this, arguments)
  }
}

function wrap(old, fn) {
  return function proxy() {
    var args = new Array(arguments.length + 1)

    args[0] = old
    for (var i = 0, len = arguments.length; i < len; i++) {
      args[i + 1] = arguments[i]
    }

    fn.apply(this, args)
  }
}

function generateOptionsResponder(res, methods) {
  return function onDone(fn, err) {
    if (err || methods.length === 0) {
      return fn(err)
    }

    trySendOptionsResponse(res, methods, fn)
  }
}

function trySendOptionsResponse(res, methods, next) {
  try {
    sendOptionsResponse(res, methods)
  } catch (err) {
    next(err)
  }
}

function matchLayer(layer, path) {
  try {
    return layer.match(path)
  } catch (err) {
    return err
  }
}

function getPathname(req) {
  try {
    return (0, _parseurl2.default)(req).pathname
  } catch (err) {
    return undefined
  }
}

function Handler(req, res, callback) {
  if (!callback) {
    callback = (0, _finalhandler2.default)(req, res)
  }

  var protohost = getProtohost(req.url) || ''
  var opts = this.$options

  var idx = 0
  var methods = void 0
  var removed = ''
  var slashAdded = false

  // middleware and routes

  // restserver layer
  var rPath =
    'string' == typeof this.$options.pathname
      ? this.$options.pathname
      : '/restserver'
  var rRoute = new _Route2.default(rPath)

  var rLayer = new _Layer2.default(
    rPath,
    {
      sensitive: opts.caseSensitive,
      strict: opts.strict,
      end: true
    },
    rRoute.dispatch.bind(rRoute)
  )

  rLayer.route = rRoute

  var stack = [].concat(_toConsumableArray(this.stack), [rLayer])

  rRoute.all(this.restserver.bind(this))

  // manage inter-router variables
  var parentUrl = req.baseUrl || ''

  var done = restore(callback, req, 'baseUrl', 'next', 'params')

  // setup next layer
  req.next = next

  // for options requests, respond with a default if nothing else responds
  if (req.method === 'OPTIONS') {
    methods = []
    done = wrap(done, generateOptionsResponder(res, methods))
  }

  // setup basic req values
  req.baseUrl = parentUrl
  req.originalUrl = req.originalUrl || req.url

  var next = function next(err) {
    var layerError = err === 'route' ? null : err

    // remove added slash
    if (slashAdded) {
      req.url = req.url.substr(1)
      slashAdded = false
    }

    // restore altered req.url
    if (removed.length !== 0) {
      req.baseUrl = parentUrl
      req.url = protohost + removed + req.url.substr(protohost.length)
      removed = ''
    }

    if (layerError === 'router') {
      ;(0, _util.defer)(done, null)
      return
    }

    if (idx >= stack.length) {
      ;(0, _util.defer)(done, layerError)
      return
    }
    var path = getPathname(req)
    if (path == null) {
      return done(layerError)
    }

    var layer = void 0
    var match = void 0
    var route = void 0

    while (match !== true && idx < stack.length) {
      layer = stack[idx++]
      match = matchLayer(layer, path)
      route = layer.route

      if (!(0, _util.isBoolean)(match)) {
        // hold on to layerError
        layerError = layerError || match
      }

      if (match !== true) {
        continue
      }

      if (!route) {
        // process non-route handlers normally
        continue
      }

      if (layerError) {
        // routes do not match with a pending error
        match = false
        continue
      }

      var method = req.method
      var has_method = route._handles_method(method)

      // build up automatic options response
      if (!has_method && method === 'OPTIONS' && methods) {
        methods.push.apply(methods, route._methods())
      }

      // don't even bother matching route
      if (!has_method && method !== 'HEAD') {
        match = false
        continue
      }
    }

    // no match
    if (match !== true) {
      return done(layerError)
    }

    // store route for dispatch on change
    if (route) {
      req.route = route
    }

    // Capture one-time layer values
    req.params = layer.params
    var layerPath = layer.path

    if (route) {
      return layer.handleRequest(req, res, next)
    }

    trim_prefix(layer, layerError, layerPath, path)
  }

  next()

  function trim_prefix(layer, layerError, layerPath, path) {
    if (layerPath.length !== 0) {
      // Validate path breaks on a path separator
      var c = path[layerPath.length]
      if (c && c !== '/') {
        next(layerError)
        return
      }

      removed = layerPath
      req.url = protohost + req.url.substr(protohost.length + removed.length)
      if (!protohost && req.url[0] !== '/') {
        req.url = '/' + req.url
        slashAdded = true
      }

      req.baseUrl =
        parentUrl +
        (removed[removed.length - 1] === '/'
          ? removed.substring(0, removed.length - 1)
          : removed)
    }

    if (layerError) {
      req._error = layerError
    }

    layer.handleRequest(req, res, next)
  }
}
