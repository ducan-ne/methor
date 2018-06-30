'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (handler, req, res, next) {
  if (handler.name === 'MethorObject') {
    handler = handler.__handler;
  }

  var methodName = req.query.method;

  var calledNext = false;

  var regexs = [[generateRegEx('(req|request)'), req], [generateRegEx('(res|resp|request)'), res], [generateRegEx('(headers)'), req.headers], [generateRegEx('(next)'), function (err) {
    calledNext = true;
    next(err);
  }]];

  for (var key in this.services) {
    var service = this.services[key];
    regexs[key] = [generateRegEx(key), service];
  }

  // ctx bind to function

  var ctx = Object.assign({
    body: req.body,
    headers: req.headers,
    userAgent: req.headers['user-agent'],
    end: res.end,
    setHeader: res.setHeader,
    $options: this.$options,
    methods: this.methods,
    betterhandler: this.BetterHandler,
    next,
    req,
    res
  }, this.$options.services, this.$options.funcs);

  req.ctx = req.ctx || ctx;

  var ctxProxy = new Proxy(req.ctx, {
    get(c, name) {
      return c[name] || req.ctx[name];
    },
    set(c, name, val) {
      return req.ctx[name] = val;
    }
  });

  var params = [];

  if ((0, _util.isFunction)(handler)) {
    params = (0, _util.getParamFunc)(handler);
  }
  if ((0, _util.isArray)(handler.$inject)) {
    params = handler.$inject;
  }
  if ((0, _util.isArray)(handler)) {
    params = handler.slice(0, -1);
    handler = handler[handler.length - 1];
    if (!(0, _util.isFunction)(handler)) throw new TypeError('argument handler is required (' + methodName + ')');
  }
  var inject = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var name = _step.value;

      var val = void 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = regexs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref = _step2.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var regex = _ref2[0];
          var obj = _ref2[1];

          if (regex.test(name)) {
            var matches = name.match(regex);
            var getByProperty = (0, _lodash2.default)(obj, name);
            if (matches && matches[1] || getByProperty) {
              val = (0, _util.getProperty)(obj, matches[matches.length - 1]) || getByProperty || obj;
            }
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

      inject.push(val || undefined);
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

  var result = handler.bind(ctxProxy).apply(undefined, inject);
  calledNext === false && this.handlerResponse(req, res, result);
};

var _util = require('../util');

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateRegEx(name) {
  return new RegExp('\\$?' + name + '\\.?(.+)?$');
}