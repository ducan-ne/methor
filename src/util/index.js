'use strict'

const _typeof = v => Object.prototype.toString.call(v).slice(8, -1)

function isDef(v) {
	return _typeof(v) == 'Undefined' || _typeof(v) == 'Null'
}

function isObject(v) {
	return _typeof(v) == 'Object'
}

function isFunction(v) {
	return _typeof(v) == 'Function'
}

function isNumber(v) {
	return _typeof(v) == 'Number'
}

function isArray(v) {
  return _typeof(v) == 'Array'
}

function isString(v) {
  return _typeof(v) == 'String'
}

function bind(fn, ctx, [req, res, next]) {
  let proxy = new Proxy({next, ...ctx}, {
    get(target, name) {
      // res.end('312321')
      if (req[name]) {
        let _req = req[name]
        if (isFunction(_res))
          return _req.bind(req)
        return _req
      }
      if (res[name]) {
        let _res = res[name]
        if (isFunction(_res))
          return _res.bind(res)
        return _res
      }
      return target[name]

    }
  })
  return fn.bind(proxy)
}

function isPromise(v) {
  return v && isFunction(v.then)
}

function getAllKeys(obj) {
	const keys = []
	for (let [key, value] of Object.entries(obj)) {
		// if (isChildrenObject ) {
    keys.push(key)
		if (isObject(value) && !isArray(value) && !isFunction(value)) {
			let subkeys = getAllKeys(value)
			for (let subkey of subkeys) {
				keys.push(key + '.' + subkey)
			}
		}
	}
	return keys
}

exports.isDef = isDef
exports.isFunction = isFunction
exports.isObject = isObject
exports.isNumber = isNumber
exports.isArray = isArray
exports.isString = isString
exports.isPromise = isPromise
exports.bind = bind
exports.identity = _ => _

// https://stackoverflow.com/questions/8556673/get-javascript-object-property-via-key-name-in-variable
exports.getProperty = function getProperty(
	targetObj,
	keyPath
) {
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


exports.getAllKeys = getAllKeys
