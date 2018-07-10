'use strict';

require('babel-polyfill');

var _http = require('http');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _router = require('router');

var _router2 = _interopRequireDefault(_router);

var _methods = require('methods');

var _methods2 = _interopRequireDefault(_methods);

var _route = require('./internal/route');

var _route2 = _interopRequireDefault(_route);

var _layer = require('./internal/layer');

var _layer2 = _interopRequireDefault(_layer);

var _init = require('./internal/init');

var _init2 = _interopRequireDefault(_init);

var _listen = require('./internal/listen');

var _listen2 = _interopRequireDefault(_listen);

var _mount = require('./internal/mount');

var _mount2 = _interopRequireDefault(_mount);

var _createMethod = require('./internal/create-method');

var _createMethod2 = _interopRequireDefault(_createMethod);

var _addRoute = require('./internal/add-route');

var _addRoute2 = _interopRequireDefault(_addRoute);

var _handler = require('./internal/handler');

var _handler2 = _interopRequireDefault(_handler);

var _lodash = require('lodash.set');

var _lodash2 = _interopRequireDefault(_lodash);

var _restserver = require('./restserver');

var _restserver2 = _interopRequireDefault(_restserver);

var _path = require('path');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Methor(opts) {
  if (!(this instanceof Methor)) {
    return new Methor(opts);
  }

  if (!opts) {
    throw new TypeError('1 argument required, but only 0 present.');
  }
  if (!(0, _util.isObject)(opts)) {
    throw new TypeError('argument options must be object');
  }

  var methods = opts.methods;

  if (!methods) throw new TypeError('option methods is required');
  if (!((0, _util.isFunction)(methods) || (0, _util.isObject)(methods))) throw new TypeError('option methods must be a function or object ');

  this.$options = opts;
  this.methods = (0, _util.getAllMethod)(methods);

  if (opts.funcs) {
    if (!(0, _util.isObject)(opts.funcs)) throw new TypeError('option funcs must be object');
    this.funcs = opts.funcs;
  }

  // --- private property ---
  this.restserver = _restserver2.default;
  this.addRoute = _addRoute2.default;
  this.$mount = _mount2.default;

  this._beforeEnter = [];
  this._beforeHanldeResponse = [];
  this._installed = [];
  this.services = {};

  this.installPlugin();

  function MethorInstance(req, res, next) {
    MethorInstance.handler(req, res, next);
  }
  (0, _util.setPropertyOf)(MethorInstance, this);

  var event = new _events2.default.EventEmitter();
  MethorInstance.$on = event.on;
  MethorInstance.$off = event.removeListener;
  MethorInstance.$emit = event.emit;
  MethorInstance.$offall = event.removeAllListeners;

  MethorInstance.stack = [];
  MethorInstance.params = {};

  MethorInstance.init();

  return MethorInstance;
}

Methor.prototype = function () {};

// Methor.prototype = Object.create(Server.prototype)
Methor.prototype.constructor = _http.Server;

Methor.prototype.handler = _handler2.default;
Methor.prototype.init = _init2.default;
Methor.prototype.listen = _listen2.default;
Methor.prototype.BetterHandler = require('./internal/better-handler').default;

Methor.prototype.beforeEnter = function beforeEnter() {
  for (var _len = arguments.length, callbacks = Array(_len), _key = 0; _key < _len; _key++) {
    callbacks[_key] = arguments[_key];
  }

  if (callbacks.length == 0) {
    throw new TypeError('argument handler is required');
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var callback = _step.value;

      if (!(0, _util.isFunction)(callback)) throw new TypeError('argument handler must be function');
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

  this._beforeEnter = [].concat(_toConsumableArray(this._beforeEnter), callbacks);
  return this;
};

Methor.prototype.beforeHandleResponse = function beforeHandleResponse() {
  for (var _len2 = arguments.length, callbacks = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    callbacks[_key2] = arguments[_key2];
  }

  if (callbacks.length == 0) {
    throw new TypeError('argument handler is required');
  }
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = callbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var callback = _step2.value;

      if (!(0, _util.isFunction)(callback)) throw new TypeError('argument handler must be function');
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

  this._beforeHanldeResponse = [].concat(_toConsumableArray(this._beforeHanldeResponse), callbacks);
  return this;
};

Methor.prototype.handlerResponse = function handlerResponse(req, res, result) {
  var _this = this;

  if (res.finished) {
    return;
  }
  var $next = function $next(callbacks) {
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if ((0, _util.isUndef)(callbacks[i])) {
      return Main();
    }
    var callback = callbacks[i];
    callback({
      get value() {
        return result;
      },
      set value(val) {
        result = val;
      },
      update(val) {
        result = val;
      }
    }, function (err) {
      return $next(callbacks, ++i);
    }, req, res);
  };

  var Main = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!res.finished) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return');

            case 2:
              if (!(result == undefined || result == null)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt('return', res.end(''));

            case 4:
              if (!((0, _util.isString)(result) || (0, _util.isNumber)(result))) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return', res.end(String(result)));

            case 6:
              if (!((0, _util.isObject)(result) || (0, _util.isArray)(result))) {
                _context.next = 8;
                break;
              }

              return _context.abrupt('return', res.json(result));

            case 8:
              return _context.abrupt('return', res.end(result.toString()));

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function Main() {
      return _ref.apply(this, arguments);
    };
  }();
  $next(this._beforeHanldeResponse);
};

Methor.prototype.warn = function warn(msg, plugin) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.warn(_chalk2.default.yellow('[') + ' Methor ' + _chalk2.default.yellow.bold('warning') + ' ' + (plugin ? 'from ' + _chalk2.default.red.bold(plugin) : '') + _chalk2.default.yellow(' ]') + ' ' + msg);
  }
};

Methor.prototype.$route = function $route(path) {
  var opts = this.$options;
  var route = new _route2.default(path);

  var layer = new _layer2.default(path, {
    sensitive: opts.caseSensitive,
    strict: opts.strict,
    end: true
  }, handle);

  function handle(req, res, next) {
    route.dispatch(req, res, next);
  }

  layer.route = route;
  this.stack.push(layer);
  return route;
};

Methor.prototype.middleware = function use(handler) {
  var offset = 0;
  var path = '/';

  if (typeof handler === 'string') {
    offset = 1;
    path = handler;
  }

  var callbacks = (0, _util.flatten)([].slice.call(arguments, offset));

  if (callbacks.length === 0) {
    throw new TypeError('argument handler is required');
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = callbacks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var fn = _step3.value;

      if (!(0, _util.isFunction)(fn)) {
        throw new TypeError('argument handler must be a function');
      }

      var layer = new _layer2.default(path, {
        sensitive: this.$options.caseSensitive,
        strict: false,
        end: false
      }, fn);

      layer.route = undefined;

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

_methods2.default.concat('all').forEach(function (method) {
  Methor.prototype[method] = function (path) {
    var route = this.$route(path);

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    route[method].apply(route, args);
    return this;
  };
});

Methor.prototype.installPlugin = function () {
  var plugins = this.$options.plugins;
  if (!plugins) return;
  var _installed = this._installed;
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = plugins[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var plugin = _step4.value;

      if (_installed.includes(plugin)) continue;

      _installed.push(plugin);

      // const args = [...arguments].slice(1)
      if ((0, _util.isFunction)(plugin.install)) {
        plugin.install.apply(this, []);
      } else if ((0, _util.isFunction)(plugin)) {
        plugin.apply(this, []);
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
};

Methor.prototype.use = function (plugin, opts) {
  var plugins = this.$options.plugins;
  if (!plugins) {
    this.$options.plugins = [];
  }
  this.$options.plugins.push((0, _util.isFunction)(plugin) && plugin.name != 'install' ? plugin(opts) : plugin);
  this.installPlugin();
  return this;
};

Methor.prototype.$option = function setOption(k, value) {
  (0, _lodash2.default)(this.$options, k, value);
  return this;
};

for (var key in util) {
  Methor.prototype[key] = Methor[key] = util[key];
}

;['validator'].map(function (name) {
  Object.defineProperty(Methor, (0, _util.capitalize)(name), {
    get() {
      var pathname = (0, _path.resolve)(__dirname, 'plugins', name);
      // $flow-disable-line
      return require(pathname).default;
    }
  });
});

Methor.createMethod = _createMethod2.default;

module.exports = Methor;