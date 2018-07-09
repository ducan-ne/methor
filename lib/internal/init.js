'use strict';

// import { Server, METHODS } from 'http'

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Init;

var _util = require('../util');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Init() {
  var opts = this.$options;
  var parseBodyJson = _bodyParser2.default.json();
  var parseBodyFormData = _bodyParser2.default.urlencoded({ extended: false });

  if ((0, _util.isObject)(opts.services)) {
    this.services = opts.services;
  }

  this.middleware(_middleware2.default);

  if ((0, _util.isArray)(opts.middlewares)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = opts.middlewares[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var mid = _step.value;

        this.middleware(mid);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  // --- BODY PARSE ---
  this.middleware(function (req, res, next) {
    if ((0, _util.isUndef)(req.body)) {
      parseBodyJson(req, res, next);
    } else {
      next();
    }
  });
  this.middleware(function (req, res, next) {
    if ((0, _util.isUndef)(req.body)) {
      parseBodyFormData(req, res, next);
    } else {
      next();
    }
  });
  // --- END BODY PARSE ---

  if ((0, _util.isString)(opts.static)) {
    try {
      var serveStatic = require('serve-static');
      this.middleware(serveStatic(opts.static));
    } catch (err) {
      throw new TypeError('you must install "serve-static" to your dependencies');
    }
  }

  if ((0, _util.isObject)(opts.routes) || (0, _util.isArray)(opts.routes)) {
    var routes = opts.routes;
    for (var index in routes) {
      if ((0, _util.isNumber)(index)) {
        this.addRoute(routes[index]);
      } else {
        this.addRoute(routes[index], index);
      }
    }
  }

  if ((0, _util.isNumber)(opts.port) || (0, _util.isNull)(opts.port)) {
    // defer(() => {
    this.listen(opts.port);
    // })
  }
}