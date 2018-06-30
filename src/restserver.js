'use strict'

import {
  getParamFunc,
  getProperty,
  isString,
  isFunction,
  bind,
  isArray,
  identity,
  isUndef
} from './util'

export default function Restserver(...args) {
  const [req, res, next] = args
  const methods = this.methods
  const that = this

  const $next = (callbacks, i = 0) => {
    if (isUndef(callbacks[i])) {
      return Main()
    }
    const callback = callbacks[i]
    this.BetterHandler(callback, req, res, function(err) {
      // next
      if (isString(err)) {
        // next(methodName)
        req.query.method = err
        return Restserver(...args)
      } else {
        $next(callbacks, ++i)
      }
    })
  }

  const beforeEnter = [...this._beforeEnter, this.$options.beforeEnter].filter(
    identity
  )

  $next(beforeEnter)

  function Main() {
    const methodName = req.query.method

    let method = methods[methodName]

    if (!method) {
      that.warn(`method ${methodName} not exist`)
      that.$emit('method.not.exist', req, res)
      return next()
    }
    that.BetterHandler(method, req, res, next)
  }
}
