/*!
 * router
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 * 
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _layer = require('./layer');

var _layer2 = _interopRequireDefault(_layer);

var _methods2 = require('methods');

var _methods3 = _interopRequireDefault(_methods2);

var _util = require('../util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Route = function () {
  function Route(path) {
    _classCallCheck(this, Route);

    this.path = path;
    this.stack = [];

    this.methods = {};
  }

  _createClass(Route, [{
    key: '_handles_method',
    value: function _handles_method(method) {
      if (this.methods._all) {
        return true;
      }

      // normalize name
      var name = method.toLowerCase();

      if (name === 'head' && !this.methods['head']) {
        name = 'get';
      }

      return Boolean(this.methods[name]);
    }
  }, {
    key: '_methods',
    value: function _methods() {
      var methods = Object.keys(this.methods);

      // append automatic head
      if (this.methods.get && !this.methods.head) {
        methods.push('head');
      }

      // $flow-disable-line
      for (var i in methods) {
        methods[i] = methods[i].toUpperCase();
      }

      return methods;
    }
  }, {
    key: 'dispatch',
    value: function dispatch(req, res, done) {
      var idx = 0;
      var stack = this.stack;
      if (stack.length === 0) {
        return done();
      }

      var method = req.method.toLowerCase();
      if (method === 'head' && !this.methods['head']) {
        method = 'get';
      }

      req.route = this;

      next();

      function next(err) {
        // signal to exit route
        if (err && err === 'route') {
          return done();
        }

        // signal to exit router
        if (err && err === 'router') {
          return done(err);
        }

        // no more matching layers
        if (idx >= stack.length) {
          return done(err);
        }

        var layer = void 0;
        var match = void 0;

        // find next matching layer
        while (match !== true && idx < stack.length) {
          layer = stack[idx++];
          match = !layer.method || layer.method === method;
        }

        // no match
        if (match !== true) {
          return done(err);
        }
        if (err) {
          throw err;
        } else {
          // $flow-disable-line
          layer.handleRequest(req, res, next);
        }
      }
    }
  }, {
    key: 'all',
    value: function all() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var callbacks = util.flatten(args);

      if (callbacks.length === 0) {
        throw new TypeError('argument handler is required');
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var fn = _step.value;

          if (!util.isFunction(fn)) {
            throw new TypeError('argument handler must be a function');
          }

          var layer = new _layer2.default('/', {}, fn);
          layer.method = undefined;

          this.methods._all = true;
          this.stack.push(layer);
        }

        // $flow-disable-line
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

      return this;
    }
  }]);

  return Route;
}();

exports.default = Route;

var _loop = function _loop(method) {
  // $flow-disable-line
  Route.prototype[method] = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var callbacks = util.flatten(args);

    if (callbacks.length === 0) {
      throw new TypeError('argument handler is required');
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = callbacks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var fn = _step3.value;

        if (!util.isFunction(fn)) {
          throw new TypeError('argument handler must be a function');
        }

        var layer = new _layer2.default('/', {}, fn);
        layer.method = method;

        this.methods[method] = true;
        this.stack.push(layer);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return this;
  };
};

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {

  for (var _iterator2 = _methods3.default[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
    var method = _step2.value;

    _loop(method);
  }
} catch (err) {
  _didIteratorError2 = true;
  _iteratorError2 = err;
} finally {
  try {
    if (!_iteratorNormalCompletion2 && _iterator2.return) {
      _iterator2.return();
    }
  } finally {
    if (_didIteratorError2) {
      throw _iteratorError2;
    }
  }
}