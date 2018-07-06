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
        if (isString(err)) {
          // next(methodName)
          req.query.method = err
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
