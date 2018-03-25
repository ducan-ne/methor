'use strict'

import {
	isString,
	isFunction,
	isObject,
	isArray,
	cleanPath,
	bind
} from './util'

export default function addRoute(router, path) {
	const _isFunction = isFunction(router)
	if (_isFunction && isString(path)) {
		router.path = path
	}
	if (isObject(router) || _isFunction) {
		let callbacks = _isFunction
			? [router]
			: isArray(router.router) ? router.router : [router.router]
		if (callbacks.length == 0)
			throw new TypeError('argument handler is required')
		let methods = ( router.method || 'get' ).split(',').map(method => {
			return method.toLowerCase() // convert all method to lower case
		})

		// allow all methods
		for (let method of methods) {
			if (!this.router[method]) // check method can use
				throw new Error('No support method '+method+' !!!')
			this.router[method](
				router.path,
				...callbacks.map(cb => {
					return (...args) => {
						let result = bind(cb, this.opts.funcs, args)(...args)
						this.handlerResponse(...args, result)
					}
				})
			)
		}
	}
	if (isArray(router.children)) { // if router has children
		for (let child of router.children) { // read all child and set router
      child.path = cleanPath(`${router.path}/${child.path}`) // replace // => /
			this.addRoute(child, path, child.path)
		}
	}
}
