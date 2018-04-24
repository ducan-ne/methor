'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var req = args[0],
      res = args[1],
      next = args[2];

  var methodName = req.query.method;
  var inject = []; // bind to method

  var method = this.methods[methodName];

  if (!method) {
    this.warn(`method ${methodName} not exist`);
    return next();
  }

  var regexs = {
    req: [generateRegEx('(req|request)'), req],
    res: [generateRegEx('(res|resp|request)'), res],
    headers: [generateRegEx('headers'), req.headers],
    next: [generateRegEx('next'), next]
  };

  for (var key in this.services) {
    var service = this.services[key];
    regexs[key] = [generateRegEx(key), service];
  }

  var setInject = function setInject(param) {
    for (var _key2 in regexs) {
      // check all regexs
      var _regexs$_key = _slicedToArray(regexs[_key2], 2),
          regex = _regexs$_key[0],
          obj = _regexs$_key[1]; // [0] -> generateRegEx, 1 -> object


      if (regex.test(param)) {
        // if ok
        var matches = param.match(regex),
            name = void 0;
        if (matches && matches[1]) {
          // if matched, name will be set to matches[last]
          name = matches[matches.length - 1];
        }
        if (name) {
          return inject.push((0, _util.getProperty)(obj, name));
        }
        return inject.push(obj);
      }
    }
    inject.push(undefined);
  };

  if ((0, _util.isArray)(method.$inject)) {
    method.$inject.map(setInject);
  } else if ((0, _util.isFunction)(method)) {
    var params = (0, _util.getParamFunc)(method);
    params.map(setInject);
  } else if ((0, _util.isArray)(method)) {
    method.slice(0, -1).map(setInject);
    method = method[method.length - 1];
    if (!(0, _util.isFunction)(method)) throw new TypeError('argument handler is required');
  }

  var result = (0, _util.bind)(method, this.opts.funcs, args).apply(undefined, inject);
  this.handlerResponse.apply(this, args.concat([result]));
};

var _util = require('./util');

var generateRegEx = function generateRegEx(name) {
  return new RegExp('\\$?' + name + '\\.?(.+)?$');
};