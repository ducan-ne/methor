'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getParamFunc = exports.identity = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.isUndef = isUndef;
exports.isRegexp = isRegexp;
exports.isDef = isDef;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isArray = isArray;
exports.isString = isString;
exports.bind = bind;
exports.isPromise = isPromise;
exports.getAllKeys = getAllKeys;
exports.cleanPath = cleanPath;
exports.getProperty = getProperty;
exports.capitalize = capitalize;

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(v) {
	return Object.prototype.toString.call(v).slice(8, -1);
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
	return _typeof(v) == 'Function';
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

function bind(fn, ctx, _ref) {
	var _ref2 = _slicedToArray(_ref, 3),
	    req = _ref2[0],
	    res = _ref2[1],
	    next = _ref2[2];

	var proxy = new Proxy(ctx, {
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

function getAllKeys(obj) {
	var keys = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.entries(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _ref3 = _step.value;

			var _ref4 = _slicedToArray(_ref3, 2);

			var key = _ref4[0];
			var value = _ref4[1];

			// if (isChildrenObject ) {
			keys.push(key);
			if (isObject(value) && !isArray(value) && !isFunction(value)) {
				var subkeys = getAllKeys(value);
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = subkeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var subkey = _step2.value;

						keys.push(key + '.' + subkey);
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
	var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var DEFAULT_PARAMS = /=[^,]+/mg;
	var FAT_ARROWS = /=>.*$/mg;
	return function (fn) {
		var code = fn.toString().replace(COMMENTS, '').replace(FAT_ARROWS, '').replace(DEFAULT_PARAMS, '');

		var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);

		return result === null ? [] : result;
	};
}();

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}