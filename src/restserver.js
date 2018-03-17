'use strict'

import {
	getParamFunc,
	getProperty,
	isString,
	isFunction,
	bind,
	isArray
} from './util'

const generateRegEx = name => {
	return new RegExp('\\$?' + name + '\\.?(.+)?$')
}

export default function(...args) {
	const [req, res, next] = args
	const methodName = req.query.method
	const inject = [] // bind to method

  let method = this.methods[methodName]

	if (!method) {
		this.warn(`method ${methodName} not exist`)
		return next()
	}

	const regexs = {
		req: [generateRegEx('(req|request)'), req],
		res: [generateRegEx('(res|resp|request)'), res],
		headers: [generateRegEx('headers'), req.headers]
	}

	for (let key in this.services) {
		const service = this.services[key]
		regexs[key] = [generateRegEx(key), service]
	}

	const setInject = (param) =>  {
		for (let key in regexs) {
			// check all regexs
			const [regex, obj] = regexs[key] // [0] -> generateRegEx, 1 -> object
			if (regex.test(param)) {
				// if ok
				let matches = param.match(regex),
            name
        if (matches && matches[1]) {
          name = matches[matches.length]
        }
				if (name) {
					return inject.push(getProperty(obj, name))
				}
				return inject.push(obj)
			}
		}
		if (param in this.services) return inject.push(this.services[param])
		inject.push(undefined)
	}

	if (isFunction(method)) {
		const params = getParamFunc(method)
		for (let param of params) {
			setInject(param)
		}
	} else if (isArray(method)) {
    let params = method.slice(0, -1)

    for (let param of params) {
      setInject(param)
    }

    method = method.slice(-1).shift()
    if (!isFunction(method))
      throw new TypeError('argument handler is required')
  }

	let result = bind(method, this.opts.funcs, args)(...inject)
	this.afterEnter(...args, result)
}
