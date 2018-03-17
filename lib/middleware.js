'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Middleware;

var _url = require('url');

function Middleware(req, res, next) {
  req.query = (0, _url.parse)(req.url, true).query;

  res.json = function json(obj) {
    res.setHeader('Content-Type', 'application/json;charset=utf8');
    res.end(JSON.stringify(obj));
  };

  res.redirect = function redirect(uri, statusCode) {
    res.statusCode = statusCode || 322;
    res.setHeader('Location', uri);
    res.end();
  };

  next();
}