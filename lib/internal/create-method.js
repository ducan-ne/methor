'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return new (Function.prototype.bind.apply(Method, [null].concat(Array.prototype.slice.call(arguments))))();
};

var _util = require('../util');

function proxy(to, from, names) {
  var _loop = function _loop(name) {
    Object.defineProperty(to, name, {
      get() {
        console.log(from[name]);
        return typeof from[name] === 'function' ? from[name].bind(from) : from[name];
      }
    });
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var name = _step.value;

      _loop(name);
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

function Method(name, handler) {
  if ((0, _util.isFunction)(name)) {
    handler = name;
  }
  handler.__name = undefined;
  handler.__validate = {};
  function MethorObject() {
    return handler.apply(undefined, arguments);
  }
  MethorObject.toString = function () {
    return handler.toString();
  };
  MethorObject.validate = function (obj) {
    MethorObject.__validate = obj;
  };
  MethorObject.mark = function (name) {
    MethorObject.__name = name;
  };
  if ((0, _util.isString)(name)) {
    MethorObject.mark(name);
  }
  return MethorObject;
}

// class Method {
//   handler: Function
//   constructor(name: Function | string, handler?: Function): Function {
//     if (isFunction(name)) {
//       handler = name
//     }
//     this.handler = handler
//     this.handler.__name = undefined
//     this.handler.__validate = {}

//     const that = this
//     function MethorObject() {
//       return that.handler(...arguments)
//     }
//     // setPropertyOf(MethorObject, this)
//     proxy(MethorObject, this.handler, ['__name', '__validate'])
//     MethorObject.validate = this.validate
//     MethorObject.mark = this.mark
//     if (isString(name)) {
//       this.mark(name)
//     }

//     return MethorObject
//   }

//   mark(newName: string): void {
//     this.handler.__name = newName
//   }

//   validate(object: Object): void {
//     this.handler.__validate = object
//   }
// }