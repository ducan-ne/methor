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
	return ['GeneratorFunction', 'AsyncFunction', 'Function'].includes(_typeof(v))
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

export function getAllKeys(obj) {
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
		let fileName = file.split('.')[0]
		obj[fileName] = require(path.resolve(dir, file))
		return obj
	}, {})
}
