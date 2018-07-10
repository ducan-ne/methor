// @flow

import {
  getParamFunc,
  getProperty,
  isString,
  isFunction,
  isArray,
  identity,
  isUndef
} from './util'
import type { HttpResponse, HttpRequest } from './types'

export default function Restserver(
  req: HttpRequest,
  res: HttpResponse,
  next: Function
): void {
  const that: any = this
  const methods = that.methods

  const $next = (callbacks: Array<Function>, i: number = 0) => {
    if (isUndef(callbacks[i])) {
      return Main()
    }
    const callback = callbacks[i]
    // $flow-disable-line
    this.BetterHandler(
      callback,
      req,
      res,
      (err: Error | string | void) => {
        // next
        if (res.finished) return
        if (isString(err)) {
          req.methodName = err
          // $flow-disable-line
          req._method = this.methods[err]
          return Restserver(...arguments)
        } else {
          $next(callbacks, ++i)
        }
      },
      false
    )
  }

  const beforeEnter = [...that._beforeEnter, that.$options.beforeEnter].filter(
    identity
  )

  $next(beforeEnter)

  function Main(): void {
    let method = req._method
    if (!method) {
      that.warn(`method ${req.methodName} not exist`)
      that.$emit('method.not.exist', req, res)
      return next()
    }
    that.BetterHandler(method, req, res, next)
  }
}
