'use strict';

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _http = require('http');

var _util = require('./util');

var _router = require('router');

var _router2 = _interopRequireDefault(_router);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _listen = require('./listen');

var _listen2 = _interopRequireDefault(_listen);

var _addRoute = require('./add-route');

var _addRoute2 = _interopRequireDefault(_addRoute);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _restserver = require('./restserver');

var _restserver2 = _interopRequireDefault(_restserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function Methor(opts) {
	if (!(this instanceof Methor)) return new Methor(opts);

	if (!opts) throw new TypeError('1 argument required, but only 0 present.');
	if (!(0, _util.isObject)(opts)) throw new TypeError('argument options must be object');

	var methods = opts.methods;

	if (!methods) throw new TypeError('option methods is required');
	if (!((0, _util.isFunction)(methods) || (0, _util.isObject)(methods))) throw new TypeError('option methods must be a function or object ');

	if (!opts.port) throw new TypeError('option port is required');
	if (!(0, _util.isNumber)(opts.port)) throw new TypeError('option port must be number');

	this.opts = opts;
	this.methods = (0, _util.getAllKeys)(methods).reduce(function (obj, methodName) {
		obj[methodName] = (0, _util.getProperty)(methods, methodName);
		return obj;
	}, {});

	if (opts.funcs) {
		if (!(0, _util.isObject)(opts.funcs)) throw new TypeError('option funcs must be object');
		this.funcs = opts.funcs;
	}

	this.$on = function (name, cb) {
		return this.on(name, cb);
	};
	this.$emit = function (name) {
		for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			data[_key - 1] = arguments[_key];
		}

		return this.emit.apply(this, [name].concat(data));
	};

	this._beforeEnter = [];
	this.services = {};

	// Server.call(this)

	this.init();
	this.listen();

	return this.proxy;
}

// Methor.prototype = Object.create(Server.prototype)
Methor.prototype.constructor = _http.Server;

Methor.prototype.init = _init2.default;
Methor.prototype.listen = _listen2.default;
Methor.prototype.middleware = _middleware2.default;
Methor.prototype.addRoute = _addRoute2.default;
Methor.prototype.restserver = _restserver2.default;

Methor.prototype.beforeEnter = function () {
	for (var _len2 = arguments.length, callbacks = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		callbacks[_key2] = arguments[_key2];
	}

	if (callbacks.length == 0) throw new TypeError('argument handler is required');
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

	this._beforeEnter = callbacks;
	return this;
};
Methor.prototype.afterEnter = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee(req, res, _, result) {
		return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (!(0, _util.isPromise)(result)) {
							_context.next = 4;
							break;
						}

						_context.next = 3;
						return result;

					case 3:
						result = _context.sent;

					case 4:
						if (!res.finished) {
							_context.next = 6;
							break;
						}

						return _context.abrupt('return', false);

					case 6:
						if (!(result == undefined || result == null)) {
							_context.next = 8;
							break;
						}

						return _context.abrupt('return', res.end(''));

					case 8:
						if (!((0, _util.isString)(result) || (0, _util.isNumber)(result))) {
							_context.next = 10;
							break;
						}

						return _context.abrupt('return', res.end(String(result)));

					case 10:
						if (!(0, _util.isObject)(result)) {
							_context.next = 12;
							break;
						}

						return _context.abrupt('return', res.json(result));

					case 12:
						res.end(result);

					case 13:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function (_x, _x2, _x3, _x4) {
		return _ref.apply(this, arguments);
	};
}();

Methor.prototype.warn = function (msg) {
	if (process.env.NODE_ENV != 'development') {
		console.warn('[ methor ] ' + msg);
	}
};

module.exports = Methor;