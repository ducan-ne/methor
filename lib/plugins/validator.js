'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return function install() {
    if (!opts.handler) throw new TypeError('opts.handler is required');
    var isRegexp = this.isRegexp,
        isFunction = this.isFunction,
        isUndef = this.isUndef,
        isArray = this.isArray,
        isString = this.isString,
        isObject = this.isObject,
        warn = this.warn;

    this.beforeEnter(function (req, res, next) {
      var methodName = req.query.method;

      var method = this.methods[methodName];

      var handlerError = function handlerError(code, validate, subcode) {
        setTimeout(function () {
          if (!res.finished) {
            warn('Seem like you have not handler for code ' + _chalk2.default.cyan(code), 'Validator');
          }
        }, 5e3);
        opts.handler(new ValidateError(method, methodName, code, subcode, req, res, validate));
      };

      if (!methodName) {
        return handlerError('MISSING_METHODNAME');
      }

      if (!method) {
        return handlerError('METHOD_NONEXIST');
      }

      if (method.__validate) {
        method.validate = method.__validate;
      }

      if (!method.validate) return next();

      var params = void 0,
          isPayload = void 0;

      try {
        if (method.validate && method.validate.__type && method.validate.__type == 'payload') {
          params = JSON.parse(req.query.payload);
          isPayload = true;
        } else {
          params = req.query;
          isPayload = false;
        }
      } catch (err) {
        return handlerError('INVALID_PAYLOAD');
      }

      var stack = [];

      /**
       * Parse a validate object
       *
       * Possiable cases:
       *  - {test?: String}
       *  - {test: {type: String}}
       *  - [{type: String, name: 'test}]
       *  - ['test']
       *  - () => *
       *
       * */

      if (isFunction(method.validate)) {
        method.validate = method.validate() || {};
      }

      if (isObject(method.validate)) {
        for (var k in method.validate) {
          var opt = method.validate[k];
          stack.push(Object.assign({ name: k, type: String }, isObject(opt) ? opt : {}));
        }
      }
      if (isArray(method.validate)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = method.validate[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var validate = _step.value;

            if (isString(validate)) {
              stack.push({
                type: String,
                name: validate
              });
            } else {
              stack.push(validate);
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
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = stack[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _validate = _step2.value;

          var _regex = _validate.regex,
              _option = _validate.option,
              _max = _validate.max,
              _min = _validate.min,
              _transform = _validate.transform,
              _validate$trim = _validate.trim,
              _trim = _validate$trim === undefined ? false : _validate$trim,
              _validate$type = _validate.type,
              _type = _validate$type === undefined ? String : _validate$type,
              _maxlength = _validate.maxlength,
              _validate$uppercase = _validate.uppercase,
              _uppercase = _validate$uppercase === undefined ? false : _validate$uppercase,
              _validate$lowercase = _validate.lowercase,
              _lowercase = _validate$lowercase === undefined ? false : _validate$lowercase,
              _minlength = _validate.minlength;

          var param = (0, _lodash2.default)(params, _validate.name);
          if (isUndef(param)) return handlerError('MISSING_PARAM', _validate);

          // String
          if (_type == String) {
            if (_trim === true) {
              (0, _lodash4.default)(params, _validate.name, param.trim());
            }
            if (_regex && isRegexp(_regex) && !_regex.test(param)) {
              return handlerError('INVALID_PARAM', _validate, 'TEST_FAIL_REGEX');
            }
            if (!param || param == '' || param == null) {
              return handlerError('INVALID_PARAM', _validate, 'EMPTY_PARAM');
            }
            if (param.length) {
              if (_minlength && param.length < _minlength) {
                return handlerError('INVALID_PARAM', _validate, 'MIN_LENGTH');
              }
              if (_maxlength && param.length > _maxlength) {
                return handlerError('INVALID_PARAM', _validate, 'MAX_LENGTH');
              }
            }
            (0, _lodash4.default)(params, _validate.name, param.toString());
            if (_uppercase) {
              (0, _lodash4.default)(params, _validate.name, param.toUpperCase());
            }
            if (_lowercase) {
              (0, _lodash4.default)(params, _validate.name, param.toLowerCase());
            }
          }

          // Number
          if (_type == Number) {
            if (!isNumber(param)) {
              return handlerError('INVALID_PARAM', _validate);
            }
            if (_min && _min < param) {
              return handlerError('INVALID_PARAM', _validate, 'NUMBER_MIN');
            }
            if (_min && param > _max) {
              return handlerError('INVALID_PARAM', _validate, 'NUMBER_MAX');
            }
            (0, _lodash4.default)(params, _validate.name, parseInt(param));
          }

          // Array
          if (_type == Array) {
            if (!isArray(param)) return handlerError('INVALID_PARAM', _validate);
          }

          // Boolean
          if (_type == Boolean) {
            if (param != true && param != false) return handlerError('INVALID_PARAM', _validate);
          }

          if (_option && isFunction(_option)) {
            var result = _option.bind(Object.assign(params, {
              isNumber
            }))(param);
            if (isUndef(result) || result != true) {
              return handlerError('INVALID_PARAM', _validate);
            }
          }
          if (_transform && isFunction(_transform)) {
            (0, _lodash4.default)(params, _validate.name, _transform(param));
          }
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

function ValidateError(method, methodName, code, subcode, req, res, validate) {
  this.name = 'ValidateError';
  this.code = code;
  this.subcode = subcode;
  this.request = req;
  this.response = res;
  this.methodName = methodName;
  this.method = method;
  this.validate = validate;
  this.stack = new Error().stack;
  Error.captureStackTrace(this);
}

ValidateError.prototype = Object.create(Error.prototype);
ValidateError.prototype.constructor = ValidateError;

var isNumber = function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};