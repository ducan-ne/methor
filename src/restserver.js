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
    headers: [generateRegEx('headers'), req.headers],
    next: [generateRegEx('next'), next]
  }

  for (let key in this.services) {
    const service = this.services[key]
    regexs[key] = [generateRegEx(key), service]
  }

  const setInject = param => {
    for (let key in regexs) {
      // check all regexs
      const [regex, obj] = regexs[key] // [0] -> generateRegEx, 1 -> object
      if (regex.test(param)) {
        // if ok
        let matches = param.match(regex),
          name
        if (matches && matches[1]) {
          // if matched, name will be set to matches[last]
          name = matches[matches.length - 1]
        }
        if (name) {
          return inject.push(getProperty(obj, name))
        }
        return inject.push(obj)
      }
    }
    inject.push(undefined)
  }

  if (isArray(method.$inject)) {
    method.$inject.map(setInject)
  } else if (isFunction(method)) {
    const params = getParamFunc(method)
    params.map(setInject)
  } else if (isArray(method)) {
    method.slice(0, -1).map(setInject)
    method = method[method.length - 1]
    if (!isFunction(method)) throw new TypeError('argument handler is required')
  }

  let result = bind(method, this.opts.funcs, args)(...inject)
  this.handlerResponse(...args, result)
}
