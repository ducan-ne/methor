'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Restserver;

var _util = require('./util');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Restserver() {
  var _this = this;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var req = args[0],
      res = args[1],
      next = args[2];

  var methods = this.methods;
  var that = this;

  var $next = function $next(callbacks) {
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if ((0, _util.isUndef)(callbacks[i])) {
      return Main();
    }
    var callback = callbacks[i];
    _this.BetterHandler(callback, req, res, function (err) {
      // next
      if ((0, _util.isString)(err)) {
        // next(methodName)
        req.query.method = err;
        return Restserver.apply(undefined, args);
      } else {
        $next(callbacks, ++i);
      }
    });
  };

  var beforeEnter = [].concat(_toConsumableArray(this._beforeEnter), [this.$options.beforeEnter]).filter(_util.identity);

  $next(beforeEnter);

  function Main() {
    var methodName = req.query.method;

    var method = methods[methodName];

    if (!method) {
      that.warn(`method ${methodName} not exist`);
      that.$emit('method.not.exist', req, res);
      return next();
    }
    that.BetterHandler(method, req, res, next);
  }
}