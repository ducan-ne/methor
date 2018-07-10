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
  var _this = this;

  var opts = this.$options;
  var parseBodyJson = _bodyParser2.default.json();
  var parseBodyFormData = _bodyParser2.default.urlencoded({ extended: false });

  if ((0, _util.isObject)(opts.services)) {
    this.services = opts.services;
  }

  this.middleware(function (req, res, next) {
    _middleware2.default.call(_this, req, res, next);
  }); // keep "this"

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

  this.middleware(function (req, res, next) {
    var query = req.query;
    var body = req.body;
    var isFunction = _this.isFunction,
        isString = _this.isString,
        opts = _this.$options;


    var methodName = void 0;

    if (isString(opts.resolveMethod)) {
      if (opts.resolveMethod === 'req.body') {
        methodName = body.method;
      }
      if (opts.resolveMethod === 'req.headers') {
        methodName = req.headers['method'];
      }
    } else if (isFunction(opts.resolveMethod)) {
      methodName = opts.resolveMethod(req, res);
    }

    if (!methodName) {
      methodName = query.method;
    }

    req.methodName = methodName;
    req._method = _this.methods[methodName];

    req.class = query.method ? query.method.split('.')[0] : false;
    next();
  });

  this.middleware(function (req, res, next) {
    var rPath = 'string' == typeof _this.$options.pathname ? _this.$options.pathname : '/restserver';
    if (req._parsedUrl.pathname === rPath) {
      _this.restserver(req, res, next);
    } else {
      next();
    }
  });

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