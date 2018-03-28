'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Init;

var _http = require('http');

var _util = require('./util');

var _router = require('router');

var _router2 = _interopRequireDefault(_router);

var _methods = require('methods');

var _methods2 = _interopRequireDefault(_methods);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Init() {
	var opts = this.opts;
	var router = opts.router || (0, _router2.default)();
	var server = opts.server || new _http.Server();
	var parseBodyJson = _bodyParser2.default.json();
	var parseBodyFormData = _bodyParser2.default.urlencoded({ extended: false });

	if (!(server instanceof _http.Server)) throw new TypeError('options.server must be abstract of http.Server');

	this.router = router;
	this.server = server;

	var self = this;

	this.proxy = new Proxy(this, {
		get(target, name, _) {
			if (name in target) return target[name];
			if (self.server && name in self.server) {
				if ((0, _util.isFunction)(self.server[name])) {
					return function () {
						var _self$server;

						(_self$server = self.server)[name].apply(_self$server, arguments);
						return target;
					};
				}
				return self.server[name];
			}
			return;
		}
	});

	if ((0, _util.isObject)(opts.services)) {
		this.services = opts.services;
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = _methods2.default.concat('all', 'use')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var k = _step.value;

			if ((0, _util.isFunction)(this.router[k])) {
				this[k] = this.router[k].bind(router);
			}
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

	router.use(this.middleware);

	// --- BODY PARSE ---
	router.use(function (req, res, next) {
		if ((0, _util.isUndef)(req.body)) {
			parseBodyJson(req, res, next);
		} else {
			next();
		}
	});
	router.use(function (req, res, next) {
		if ((0, _util.isUndef)(req.body)) {
			parseBodyFormData(req, res, next);
		} else {
			next();
		}
	});
	// --- END BODY PARSE ---

	if ((0, _util.isArray)(opts.middlewares)) {
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = opts.middlewares[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var mid = _step2.value;

				router.use(mid);
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
	}

	if ((0, _util.isString)(opts.static)) {
		try {
			var serveStatic = require('serve-static');
			router.use(serveStatic(opts.static));
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

	var beforeEnter = [].concat(_toConsumableArray(this._beforeEnter), [this.opts.beforeEnter]).filter(_util.identity); // remove if opt.beforeEnter is undefined, bind method

	var restserverPath = this.opts._restserverPath;

	router.all.apply(router, [(0, _util.isString)(restserverPath) ? restserverPath : '/restserver'].concat(_toConsumableArray(beforeEnter), [this.restserver.bind(this)]));

	return this.proxy;
}