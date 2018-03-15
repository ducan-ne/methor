'use strict'

const {
	isString,
	isFunction,
	isObject,
	isArray,
	cleanPath,
	bind
} = require('./util')

module.exports = addRoute

function addRoute(router, path) {
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
		this.router[(router.method || 'get').toLowerCase()](
			router.path,
			...callbacks.map(cb => {
				return (...args) => {
					let result = bind(cb, this.opts.funcs, args)(...args)
					this.afterEnter(...args, result)
				}
			})
		)
	}
	if (isArray(router.children)) {
		for (let child of router.children) {
      child.path = cleanPath(`${router.path}/${child.path}`)
			this.addRoute(child, path, child.path)
		}
	}
}
