'use strict'

import get from 'lodash.get'
import set from 'lodash.set'
import chalk from 'chalk'

function ValidateError(method, methodName, code, req, res, validate) {
	this.code = code
	this.request = req
	this.response = res
	this.methodName = methodName
	this.method = method
	this.validate = validate
	this.stack = new Error().stack
}

ValidateError.prototype = Object.create(Error.prototype)
ValidateError.prototype.constructor = ValidateError

const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n)

export default function(opts) {
	return function install() {
		if (!opts.handler) throw new TypeError('opts.handler is required')
		const { isRegexp, isFunction, isUndef, isArray, warn } = this
		this.beforeEnter((req, res, next) => {
			const methodName = req.query.method
			const method = this.methods[methodName]

			const handlerError = (code, validate) => {
				setTimeout(() => {
					if (!res.finished) {
						warn(
							'Seem like you have not handler for code ' + chalk.cyan(code),
							'Validator'
						)
					}
				}, 5e3)
				opts.handler(
					new ValidateError(method, methodName, code, req, res, validate)
				)
			}

			if (!method) {
				return handlerError('METHOD_NONEXIST')
			}

      if (!method.validate) return next()
      

			let params, isPayload

			try {
				if (
					method.validate &&
					method.validate.type &&
					method.validate.type == 'payload'
				) {
					params = JSON.parse(req.query.payload)
					isPayload = true
				} else {
					params = req.query
					isPayload = false
				}
			} catch (err) {
				return handlerError('INVALID_PAYLOAD')
			}

			for (let validate of method.validate) {
				const {
					regex,
					option,
					transform,
					trim = false,
					type = String
				} = validate
				let param = get(params, validate.name)
				if (isUndef(param)) return handlerError('MISSING_PARAM', validate)

				if (isUndef(transform)) {
					set(params, validate.name, transform(param))
				}

				// String
				if (type == String) {
					if (trim === true) {
						set(params, validate.name, param.trim())
					}
					if (isRegexp(regex) && !regex.test(param)) {
						return handlerError('INVALID_PARAM', validate)
					}
					if (!param || param == '' || param == null)
						return handlerError('INVALID_PARAM', validate)
					set(params, validate.name, param.toString())
				}

				// Number
				if (type == Number) {
					if (!isNumber(param)) return handlerError('INVALID_PARAM', validate)
					set(params, validate.name, parseInt(param))
				}

				// Array
				if (type == Array) {
					if (!isArray(param)) return handlerError('INVALID_PARAM', validate)
				}

				// Boolean
				if (type == Boolean) {
					if (param != true && param != false)
						return handlerError('INVALID_PARAM', validate)
				}

				if (isFunction(option)) {
					let result = option.bind(Object.assign(params, { isNumber }))(param)
					if (isUndef(result) || result != true) {
						return handlerError('INVALID_PARAM', validate)
					}
				}
			}

			if (isPayload) {
				req.query.payload = params
			}

			next()
		})
	}
}
