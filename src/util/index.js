// @flow

import get from 'lodash.get'
import fs from 'fs'
import path from 'path'

export function _typeof(v: any): string {
  return Object.prototype.toString.call(v).slice(8, -1)
}

export function isNull(v: any): boolean {
  return _typeof(v) == 'Null'
}

export function isUndef(v: any): boolean {
  return _typeof(v) == 'Undefined' || _typeof(v) == 'Null'
}

export function isRegexp(v: any): boolean {
  return _typeof(v) == 'RegExp'
}

export function isDef(v: any): boolean {
  return _typeof(v) != 'Undefined' || _typeof(v) != 'Null'
}

export function isObject(v: any): boolean {
  return _typeof(v) == 'Object'
}

export function isFunction(v: any): boolean %checks {
  return !!~['GeneratorFunction', 'AsyncFunction', 'Function'].indexOf(
    _typeof(v)
  )
}

export function isNumber(v: any): boolean {
  return _typeof(v) == 'Number'
}

export function isArray(v: any): boolean {
  return _typeof(v) == 'Array'
}

export function isString(v: any): boolean {
  return _typeof(v) == 'String'
}

export function isBoolean(v: any): boolean {
  return _typeof(v) == 'Boolean'
}

// --- deprecated ----
// export function bind(fn, ctx, [req, res, next]) {
//   let proxy = new Proxy(ctx || {}, {
//     get(target, name) {
//       // res.end('312321')
//       if (req[name]) {
//         let _req = req[name]
//         if (isFunction(_res)) return _req.bind(req)
//         return _req
//       }
//       if (res[name]) {
//         let _res = res[name]
//         if (isFunction(_res)) return _res.bind(res)
//         return _res
//       }
//       return target[name]
//     }
//   })
//   return fn.bind(proxy)
// }

export function isPromise(v: any): boolean {
  return v && isFunction(v.then)
}

type Method = {
  [key: any]: Function
}

export function getAllMethod(
  obj: Object,
  prefix?: string = '',
  separate?: string = '.'
) {
  const leftBracket = { '[]': '[', '.': '.', '/': '/' }[separate]
  const rightBracket = { '[]': ']' }[separate] || ''

  function reduce(res: Object, el: string) {
    let method = obj[el]
    if (method !== null && isObject(method)) {
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
    if (isFunction(isArray(method) ? method.slice().pop() : method)) {
      let name =
        prefix +
        (prefix === '' ? '' : leftBracket) +
        el +
        (prefix === '' ? '' : rightBracket)
      res[method.__name || name] = method
    }
    return res
  }
  let keys: Method = Object.keys(obj).reduce(reduce, {})
  if (prefix === '' && separate === '.') {
    // console.log(prefix)
    keys = Object.assign(
      keys,
      getAllMethod(obj, prefix, '[]'),
      getAllMethod(obj, prefix, '/')
    )
  }
  return keys
}

export function cleanPath(path: string): string {
  return path.replace(/\/\//g, '/')
}

export const identity = (_: any) => _

export function getProperty(targetObj: any, keyPath: string) {
  return get(targetObj, keyPath)
  // var keys = keyPath.split('.')
  // if (keys.length == 0) return undefined
  // keys = keys.reverse()
  // var subObject = targetObj
  // while (keys.length) {
  //   var k = keys.pop()
  //   if (!subObject.hasOwnProperty(k)) {
  //     return undefined
  //   } else {
  //     subObject = subObject[k]
  //   }
  // }
  // return subObject
}

// get-parameter-names
export const getParamFunc = (function() {
  const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
  const DEFAULT_PARAMS = /=[^,]+/gm
  const FAT_ARROWS = /=>.*$/gm
  return function(fn: Function): Array<any> {
    let code = fn
      .toString()
      .replace(COMMENTS, '')
      .replace(FAT_ARROWS, '')
      .replace(DEFAULT_PARAMS, '')

    let result: Array<any> =
      code
        .slice(code.indexOf('(') + 1, code.indexOf(')'))
        .match(/([^\s,]+)/g) || []

    return result
  }
})()

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function requireall(dir: string): Object {
  return fs.readdirSync(dir).reduce((obj, file) => {
    if (file == 'index.js' || file.split('.').pop() != 'js') return obj
    let fileName = file.split('.')[0]
    let fullpath: string = path.resolve(dir, file)
    obj[fileName] = require(fullpath)
    return obj
  }, {})
}

export function flatten(arr: any): any {
  return [].concat.apply([], arr)
}

export const defer =
  typeof setImmediate === 'function'
    ? setImmediate
    : function(fn: Function, ...otherArgs: any) {
        // $flow-disable-line
        process.nextTick(fn.bind.apply(fn, arguments))
      }

export const setPropertyOf =
  Object.setPrototypeOf ||
  // $flow-disable-line
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
