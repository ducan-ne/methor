/*!
 * router
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hasOwnProperty = Object.prototype.hasOwnProperty;

var Layer = function () {
  function Layer(path, options, fn) {
    _classCallCheck(this, Layer);

    var opts = options || {};

    this.handle = fn;
    this.name = fn.name || '<anonymous>';
    this.params = undefined;
    this.path = undefined;
    this.regexp = (0, _pathToRegexp2.default)(path, this.keys = [], opts);

    // set fast path flags
    this.regexp.fast_star = path === '*';
    this.regexp.fast_slash = path === '/' && opts.end === false;
  }

  _createClass(Layer, [{
    key: 'handleRequest',
    value: function handleRequest(req, res, next) {
      var fn = this.handle;

      if (fn.length > 3) {
        // not a standard request handler
        return next();
      }

      try {
        fn(req, res, next);
      } catch (err) {
        next(err);
      }
    }
  }, {
    key: 'match',
    value: function match(path) {
      var match;

      if (path != null) {
        // fast path non-ending match for / (any path matches)
        if (this.regexp.fast_slash) {
          this.params = {};
          this.path = '';
          return true;
        }

        // fast path for * (everything matched in a param)
        if (this.regexp.fast_star) {
          this.params = { '0': decodeParam(path) };
          this.path = path;
          return true;
        }

        // match the path
        match = this.regexp.exec(path);
      }

      if (!match) {
        this.params = undefined;
        this.path = undefined;
        return false;
      }

      // store values
      this.params = {};
      this.path = match[0];

      // iterate matches
      var keys = this.keys;
      var params = this.params;

      for (var i = 1; i < match.length; i++) {
        var key = keys[i - 1];
        var prop = key.name;
        var val = decodeParam(match[i]);

        if (val !== undefined || !hasOwnProperty.call(params, prop)) {
          params[prop] = val;
        }
      }

      return true;
    }
  }]);

  return Layer;
}();

exports.default = Layer;


function decodeParam(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = "Failed to decode param '" + val + "'";
      err.status = 400;
    }

    throw err;
  }
}