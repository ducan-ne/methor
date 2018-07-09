'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Restserver;

var _util = require('./util');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Restserver(req, res, next) {
  var _this = this,
      _arguments = arguments;

  var that = this;
  var methods = that.methods;
  var method = req.method = req.query.method || req.body.method;

  var $next = function $next(callbacks) {
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if ((0, _util.isUndef)(callbacks[i])) {
      return Main();
    }
    var callback = callbacks[i];
    // $flow-disable-line
    _this.BetterHandler(callback, req, res, function (err) {
      // next
      if ((0, _util.isString)(err)) {
        req.methodName = err;
        // $flow-disable-line
        req._method = _this.methods[err];
        return Restserver.apply(undefined, _arguments);
      } else {
        $next(callbacks, ++i);
      }
    }, false);
  };

  var beforeEnter = [].concat(_toConsumableArray(that._beforeEnter), [that.$options.beforeEnter]).filter(_util.identity);

  $next(beforeEnter);

  function Main() {
    var method = req._method;
    if (!method) {
      that.warn(`method ${req.methodName} not exist`);
      that.$emit('method.not.exist', req, res);
      return next();
    }
    that.BetterHandler(method, req, res, next);
  }
}