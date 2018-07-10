'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require('../util');

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function generateRegEx(name) {
  return new RegExp('(\\$?' + name + '\\.?(.+)?$)');
}

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(handler, req, res, next) {
    var handlerIfNoRes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    var opts, isFunction, isPromise, calledNext, regexs, key, service, ctx, ctxProxy, params, inject, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, val, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _ref2, _ref3, regex, obj, matches, getByProperty, result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            opts = this.$options, isFunction = this.isFunction, isPromise = this.isPromise;


            if (handler.name === 'MethorObject') {}

            calledNext = false;
            regexs = [[generateRegEx('req|request'), req], [generateRegEx('res|resp|request'), res], [generateRegEx('headers'), req.headers], [generateRegEx('next'), function (err) {
              calledNext = true;
              next(err);
            }]];


            for (key in this.services) {
              service = this.services[key];

              regexs.push([generateRegEx(key), service]);
            }

            // ctx bind to function

            ctx = Object.assign({
              body: req.body,
              query: req.query,
              headers: req.headers,
              userAgent: req.headers['user-agent'],
              end: res.end,
              setHeader: res.setHeader,
              $options: this.$options,
              methods: this.methods,
              method: req._method,
              methodName: req.methodName,
              betterhandler: this.BetterHandler,
              redirect: res.redirect,
              next,
              req,
              res
            }, this.$options.services, this.$options.funcs);


            req.ctx = req.ctx || ctx;

            _context.t0 = Proxy;
            _context.t1 = req.ctx;
            _context.t2 = {
              get(c, name) {
                return c[name] || req.ctx[name];
              },
              set(c, name, val) {
                return req.ctx[name] = val;
              }
            };
            ctxProxy = new _context.t0(_context.t1, _context.t2);
            params = [];


            if (isFunction(handler)) {
              params = (0, _util.getParamFunc)(handler);
            }
            if ((0, _util.isArray)(handler.$inject)) {
              params = handler.$inject;
            }

            if (!(0, _util.isArray)(handler)) {
              _context.next = 19;
              break;
            }

            params = handler.slice(0, -1);
            handler = handler[handler.length - 1];

            if (isFunction(handler)) {
              _context.next = 19;
              break;
            }

            throw new TypeError('argument handler is required (' + req.methodName + ')');

          case 19:
            inject = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 23;
            _iterator = params[Symbol.iterator]();

          case 25:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 51;
              break;
            }

            name = _step.value;
            val = void 0;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 31;

            for (_iterator2 = regexs[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              _ref2 = _step2.value;
              _ref3 = _slicedToArray(_ref2, 2);
              regex = _ref3[0];
              obj = _ref3[1];

              if (regex.test(name)) {
                matches = name.match(regex);
                getByProperty = (0, _lodash2.default)(obj, name);

                if (matches && matches[1] || getByProperty) {
                  val = (0, _util.getProperty)(obj, matches[matches.length - 1]) || getByProperty || obj;
                }
              }
            }
            _context.next = 39;
            break;

          case 35:
            _context.prev = 35;
            _context.t3 = _context['catch'](31);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t3;

          case 39:
            _context.prev = 39;
            _context.prev = 40;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 42:
            _context.prev = 42;

            if (!_didIteratorError2) {
              _context.next = 45;
              break;
            }

            throw _iteratorError2;

          case 45:
            return _context.finish(42);

          case 46:
            return _context.finish(39);

          case 47:
            inject.push(val || undefined);

          case 48:
            _iteratorNormalCompletion = true;
            _context.next = 25;
            break;

          case 51:
            _context.next = 57;
            break;

          case 53:
            _context.prev = 53;
            _context.t4 = _context['catch'](23);
            _didIteratorError = true;
            _iteratorError = _context.t4;

          case 57:
            _context.prev = 57;
            _context.prev = 58;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 60:
            _context.prev = 60;

            if (!_didIteratorError) {
              _context.next = 63;
              break;
            }

            throw _iteratorError;

          case 63:
            return _context.finish(60);

          case 64:
            return _context.finish(57);

          case 65:
            result = handler.apply(ctxProxy, inject);

            if (!isPromise(result)) {
              _context.next = 76;
              break;
            }

            _context.prev = 67;
            _context.next = 70;
            return result;

          case 70:
            result = _context.sent;
            _context.next = 76;
            break;

          case 73:
            _context.prev = 73;
            _context.t5 = _context['catch'](67);

            if (isFunction(opts.catchHandler)) {
              opts.catchHandler(_context.t5, req, res);
            } else {
              console.error(_context.t5);
            }

          case 76:
            if (!(!handlerIfNoRes && !result)) {
              _context.next = 78;
              break;
            }

            return _context.abrupt('return');

          case 78:
            calledNext === false && this.handlerResponse(req, res, result);

          case 79:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[23, 53, 57, 65], [31, 35, 39, 47], [40,, 42, 46], [58,, 60, 64], [67, 73]]);
  }));

  return function (_x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();