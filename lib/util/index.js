'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPropertyOf = exports.defer = exports.getParamFunc = exports.identity = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports._typeof = _typeof;
exports.isNull = isNull;
exports.isUndef = isUndef;
exports.isRegexp = isRegexp;
exports.isDef = isDef;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isArray = isArray;
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.bind = bind;
exports.isPromise = isPromise;
exports.getAllMethod = getAllMethod;
exports.cleanPath = cleanPath;
exports.getProperty = getProperty;
exports.capitalize = capitalize;
exports.requireall = requireall;
exports.flatten = flatten;

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(v) {
  return Object.prototype.toString.call(v).slice(8, -1);
}

function isNull(v) {
  return _typeof(v) == 'Null';
}

function isUndef(v) {
  return _typeof(v) == 'Undefined' || _typeof(v) == 'Null';
}

function isRegexp(v) {
  return _typeof(v) == 'RegExp';
}

function isDef(v) {
  return _typeof(v) != 'Undefined' || _typeof(v) != 'Null';
}

function isObject(v) {
  return _typeof(v) == 'Object';
}

function isFunction(v) {
  return !!~['GeneratorFunction', 'AsyncFunction', 'Function'].indexOf(_typeof(v));
}

function isNumber(v) {
  return _typeof(v) == 'Number';
}

function isArray(v) {
  return _typeof(v) == 'Array';
}

function isString(v) {
  return _typeof(v) == 'String';
}

function isBoolean(v) {
  return _typeof(v) == 'Boolean';
}

function bind(fn, ctx, _ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      req = _ref2[0],
      res = _ref2[1],
      next = _ref2[2];

  var proxy = new Proxy(ctx || {}, {
    get(target, name) {
      // res.end('312321')
      if (req[name]) {
        var _req = req[name];
        if (isFunction(_res)) return _req.bind(req);
        return _req;
      }
      if (res[name]) {
        var _res2 = res[name];
        if (isFunction(_res2)) return _res2.bind(res);
        return _res2;
      }
      return target[name];
    }
  });
  return fn.bind(proxy);
}

function isPromise(v) {
  return v && isFunction(v.then);
}

function getAllMethod(obj) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var separate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';

  var leftBracket = { '[]': '[', '.': '.', '/': '/' }[separate];
  var rightBracket = { '[]': ']' }[separate] || '';

  function reduce(res, el) {
    if (obj[el] !== null && isObject(obj[el])) {
      var _prefix = prefix;
      if (separate === '[]') {
        if (prefix === '') {
          _prefix += el;
        } else {
          _prefix += '[' + el + ']';
        }
      } else if (separate === '/') {
        _prefix += prefix === '' ? el : '/' + el;
      } else {
        _prefix += el;
      }
      return Object.assign(res, getAllMethod(obj[el], _prefix, separate));
    }
    if (isFunction(isArray(obj[el]) ? obj[el].slice().pop() : obj[el])) {
      res[prefix + leftBracket + el + rightBracket] = obj[el];
    }
    return res;
  }
  var keys = Object.keys(obj).reduce(reduce, {});
  if (prefix === '' && separate == '.') {
    // console.log(prefix)
    keys = Object.assign(keys, getAllMethod(obj, prefix, '[]'), getAllMethod(obj, prefix, '/'));
  }
  return keys;
}

function cleanPath(path) {
  return path.replace(/\/\//g, '/');
}

var identity = exports.identity = function identity(_) {
  return _;
};

// https://stackoverflow.com/questions/8556673/get-javascript-object-property-via-key-name-in-variable
function getProperty(targetObj, keyPath) {
  return (0, _lodash2.default)(targetObj, keyPath);
  var keys = keyPath.split('.');
  if (keys.length == 0) return undefined;
  keys = keys.reverse();
  var subObject = targetObj;
  while (keys.length) {
    var k = keys.pop();
    if (!subObject.hasOwnProperty(k)) {
      return undefined;
    } else {
      subObject = subObject[k];
    }
  }
  return subObject;
}

// get-parameter-names
var getParamFunc = exports.getParamFunc = function () {
  var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  var DEFAULT_PARAMS = /=[^,]+/gm;
  var FAT_ARROWS = /=>.*$/gm;
  return function (fn) {
    var code = fn.toString().replace(COMMENTS, '').replace(FAT_ARROWS, '').replace(DEFAULT_PARAMS, '');

    var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);

    return result === null ? [] : result;
  };
}();

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function requireall(dir) {
  return _fs2.default.readdirSync(dir).reduce(function (obj, file) {
    if (file == 'index.js' || file.split('.').pop() != 'js') return obj;
    var fileName = file.split('.')[0];
    obj[fileName] = require(_path2.default.resolve(dir, file));
    return obj;
  }, {});
}

function flatten(arr) {
  return [].concat.apply([], arr);
}

var defer = exports.defer = typeof setImmediate === 'function' ? setImmediate : function (fn) {
  process.nextTick(fn.bind.apply(fn, arguments));
};

var setPropertyOf = exports.setPropertyOf = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);

function setProtoOf(obj, proto) {
  obj.__proto__ = proto;
  return obj;
}

function mixinProperties(obj, proto) {
  for (var prop in proto) {
    if (!obj.hasOwnProperty(prop)) {
      obj[prop] = proto[prop];
    }
  }
  return obj;
}