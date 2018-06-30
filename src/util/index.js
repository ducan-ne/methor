'use strict'

import get from 'lodash.get'
import fs from 'fs'
import path from 'path'

export function _typeof(v) {
  return Object.prototype.toString.call(v).slice(8, -1)
}

export function isNull(v) {
  return _typeof(v) == 'Null'
}

export function isUndef(v) {
  return _typeof(v) == 'Undefined' || _typeof(v) == 'Null'
}

export function isRegexp(v) {
  return _typeof(v) == 'RegExp'
}

export function isDef(v) {
  return _typeof(v) != 'Undefined' || _typeof(v) != 'Null'
}

export function isObject(v) {
  return _typeof(v) == 'Object'
}

export function isFunction(v) {
  return !!~['GeneratorFunction', 'AsyncFunction', 'Function'].indexOf(
    _typeof(v)
  )
}

export function isNumber(v) {
  return _typeof(v) == 'Number'
}

export function isArray(v) {
  return _typeof(v) == 'Array'
}

export function isString(v) {
  return _typeof(v) == 'String'
}

export function isBoolean(v) {
  return _typeof(v) == 'Boolean'
}

export function bind(fn, ctx, [req, res, next]) {
  let proxy = new Proxy(ctx || {}, {
    get(target, name) {
      // res.end('312321')
      if (req[name]) {
        let _req = req[name]
        if (isFunction(_res)) return _req.bind(req)
        return _req
      }
      if (res[name]) {
        let _res = res[name]
        if (isFunction(_res)) return _res.bind(res)
        return _res
      }
      return target[name]
    }
  })
  return fn.bind(proxy)
}

export function isPromise(v) {
  return v && isFunction(v.then)
}

export function getAllMethod(obj, prefix = '', separate = '.') {
  const leftBracket = { '[]': '[', '.': '.', '/': '/' }[separate]
  const rightBracket = { '[]': ']' }[separate] || ''

  function reduce(res, el) {
    if (obj[el] !== null && isObject(obj[el])) {
      let _prefix = prefix
      if (separate === '[]') {
        if (prefix === '') {
          _prefix += el
        } else {
          _prefix += '[' + el + ']'
        }
      } else if (separate === '/') {
        _prefix += prefix === '' ? el : '/' + el
      } else {
        _prefix += el
      }
      return Object.assign(res, getAllMethod(obj[el], _prefix, separate))
    }
    if (isFunction(isArray(obj[el]) ? obj[el].slice().pop() : obj[el])) {
      res[prefix + leftBracket + el + rightBracket] = obj[el]
    }
    return res
  }
  let keys = Object.keys(obj).reduce(reduce, {})
  if (prefix === '' && separate == '.') {
    // console.log(prefix)
    keys = Object.assign(
      keys,
      getAllMethod(obj, prefix, '[]'),
      getAllMethod(obj, prefix, '/')
    )
  }
  return keys
}

export function cleanPath(path) {
  return path.replace(/\/\//g, '/')
}

export const identity = _ => _

// https://stackoverflow.com/questions/8556673/get-javascript-object-property-via-key-name-in-variable
export function getProperty(targetObj, keyPath) {
  return get(targetObj, keyPath)
  var keys = keyPath.split('.')
  if (keys.length == 0) return undefined
  keys = keys.reverse()
  var subObject = targetObj
  while (keys.length) {
    var k = keys.pop()
    if (!subObject.hasOwnProperty(k)) {
      return undefined
    } else {
      subObject = subObject[k]
    }
  }
  return subObject
}

// get-parameter-names
export const getParamFunc = (function() {
  const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
  const DEFAULT_PARAMS = /=[^,]+/gm
  const FAT_ARROWS = /=>.*$/gm
  return function(fn) {
    var code = fn
      .toString()
      .replace(COMMENTS, '')
      .replace(FAT_ARROWS, '')
      .replace(DEFAULT_PARAMS, '')

    var result = code
      .slice(code.indexOf('(') + 1, code.indexOf(')'))
      .match(/([^\s,]+)/g)

    return result === null ? [] : result
  }
})()

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function requireall(dir) {
  return fs.readdirSync(dir).reduce((obj, file) => {
    if (file == 'index.js' || file.split('.').pop() != 'js') return obj
    let fileName = file.split('.')[0]
    obj[fileName] = require(path.resolve(dir, file))
    return obj
  }, {})
}

export function flatten(arr) {
  return [].concat.apply([], arr)
}

export const defer =
  typeof setImmediate === 'function'
    ? setImmediate
    : function(fn) {
        process.nextTick(fn.bind.apply(fn, arguments))
      }

export const setPropertyOf =
  Object.setPrototypeOf ||
  ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties)

function setProtoOf(obj, proto) {
  obj.__proto__ = proto
  return obj
}

function mixinProperties(obj, proto) {
  for (var prop in proto) {
    if (!obj.hasOwnProperty(prop)) {
      obj[prop] = proto[prop]
    }
  }
  return obj
}
