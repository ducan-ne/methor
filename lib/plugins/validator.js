'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (opts) {
	return function install() {
		var _this = this;

		if (!opts.handler) throw new TypeError('opts.handler is required');
		var isRegexp = this.isRegexp,
		    isFunction = this.isFunction,
		    isUndef = this.isUndef,
		    isArray = this.isArray,
		    warn = this.warn;

		this.beforeEnter(function (req, res, next) {
			var methodName = req.query.method;

			var method = _this.methods[methodName];

			var handlerError = function handlerError(code, validate) {
				setTimeout(function () {
					if (!res.finished) {
						warn('Seem like you have not handler for code ' + _chalk2.default.cyan(code), 'Validator');
					}
				}, 5e3);
				opts.handler(new ValidateError(method, methodName, code, req, res, validate));
			};

			if (!methodName) {
				return handlerError('MISSING_METHODNAME');
			}

			if (!method) {
				return handlerError('METHOD_NONEXIST');
			}

			if (!method.validate) return next();

			var params = void 0,
			    isPayload = void 0;

			try {
				if (method.validate && method.validate.type && method.validate.type == 'payload') {
					params = JSON.parse(req.query.payload);
					isPayload = true;
				} else {
					params = req.query;
					isPayload = false;
				}
			} catch (err) {
				return handlerError('INVALID_PAYLOAD');
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = method.validate[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var validate = _step.value;
					var regex = validate.regex,
					    option = validate.option,
					    transform = validate.transform,
					    _validate$trim = validate.trim,
					    trim = _validate$trim === undefined ? false : _validate$trim,
					    _validate$type = validate.type,
					    type = _validate$type === undefined ? String : _validate$type;

					var param = (0, _lodash2.default)(params, validate.name);
					if (isUndef(param)) return handlerError('MISSING_PARAM', validate);

					if (isFunction(transform)) {
						(0, _lodash4.default)(params, validate.name, transform(param));
					}

					// String
					if (type == String) {
						if (trim === true) {
							(0, _lodash4.default)(params, validate.name, param.trim());
						}
						if (isRegexp(regex) && !regex.test(param)) {
							return handlerError('INVALID_PARAM', validate);
						}
						if (!param || param == '' || param == null) return handlerError('INVALID_PARAM', validate);
						(0, _lodash4.default)(params, validate.name, param.toString());
					}

					// Number
					if (type == Number) {
						if (!isNumber(param)) return handlerError('INVALID_PARAM', validate);
						(0, _lodash4.default)(params, validate.name, parseInt(param));
					}

					// Array
					if (type == Array) {
						if (!isArray(param)) return handlerError('INVALID_PARAM', validate);
					}

					// Boolean
					if (type == Boolean) {
						if (param != true && param != false) return handlerError('INVALID_PARAM', validate);
					}

					if (isFunction(option)) {
						var result = option.bind(Object.assign(params, { isNumber }))(param);
						if (isUndef(result) || result != true) {
							return handlerError('INVALID_PARAM', validate);
						}
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

			if (isPayload) {
				req.query.payload = params;
			}

			next();
		});
	};
};

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.set');

var _lodash4 = _interopRequireDefault(_lodash3);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ValidateError(method, methodName, code, req, res, validate) {
	this.code = code;
	this.request = req;
	this.response = res;
	this.methodName = methodName;
	this.method = method;
	this.validate = validate;
	this.stack = new Error().stack;
}

ValidateError.prototype = Object.create(Error.prototype);
ValidateError.prototype.constructor = ValidateError;

var isNumber = function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};