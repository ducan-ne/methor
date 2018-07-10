import finalhandler from 'finalhandler'
import { defer, isBoolean } from '../util'
import parseurl from 'parseurl'
import Route from './route'
import Layer from './layer'

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

function sendOptionsResponse(res, methods) {
  const options = Object.create(null)

  // build unique method map
  for (let i = 0; i < methods.length; i++) {
    options[methods[i]] = true
  }

  // construct the allow list
  const allow = Object.keys(options)
    .sort()
    .join(', ')

  // send response
  res.setHeader('Allow', allow)
  res.setHeader('Content-Length', Buffer.byteLength(allow))
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.end(allow)
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
    return parseurl(req).pathname
  } catch (err) {
    return undefined
  }
}

export default function Handler(req, res, callback) {
  if (!callback) {
    callback = finalhandler(req, res)
  }

  const protohost = getProtohost(req.url) || ''
  const opts = this.$options

  let idx = 0
  let methods
  let removed = ''
  let slashAdded = false

  // middleware and routes

  // restserver layer
  const rPath =
    'string' == typeof this.$options.pathname
      ? this.$options.pathname
      : '/restserver'

  const rRoute = new Route(rPath)

  const rLayer = new Layer(
    rPath,
    {
      sensitive: opts.caseSensitive,
      strict: opts.strict,
      end: true
    },
    rRoute.dispatch.bind(rRoute)
  )

  rLayer.route = rRoute

  const stack = [...this.stack, rLayer]

  rRoute.all(this.restserver.bind(this))

  // manage inter-router variables
  const parentUrl = req.baseUrl || ''

  let done = restore(callback, req, 'baseUrl', 'next', 'params')

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

  const next = err => {
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
      defer(done, null)
      return
    }

    if (idx >= stack.length) {
      defer(done, layerError)
      return
    }
    const path = getPathname(req)
    if (path == null) {
      return done(layerError)
    }

    let layer
    let match
    let route

    while (match !== true && idx < stack.length) {
      layer = stack[idx++]
      match = matchLayer(layer, path)
      route = layer.route

      if (!isBoolean(match)) {
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
    let layerPath = layer.path

    if (route) {
      return layer.handleRequest(req, res, next)
    }

    trim_prefix(layer, layerError, layerPath, path)
  }

  next()

  function trim_prefix(layer, layerError, layerPath, path) {
    if (layerPath.length !== 0) {
      // Validate path breaks on a path separator
      const c = path[layerPath.length]
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
