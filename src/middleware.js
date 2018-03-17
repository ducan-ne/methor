'use strict'

import {parse} from 'url'

export default function Middleware(req, res, next) {
  req.query = parse(req.url, true).query

  res.json = function json(obj) {
    res.setHeader('Content-Type', 'application/json;charset=utf8')
    res.end(JSON.stringify(obj))
  }

  res.redirect = function redirect(uri, statusCode) {
    res.statusCode = statusCode || 322
    res.setHeader('Location', uri)
    res.end()
  }

  next()
}
