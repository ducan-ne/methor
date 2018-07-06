// @flow

import { isString, isFunction, isObject, isArray, cleanPath } from '../util'
import type { Route } from '../types'

export default function addRoute(router: Route, path: string): void {
  const RouterisFunction: boolean = isFunction(router)
  if (RouterisFunction && isString(path)) {
    router.path = path
  }
  if (isObject(router) || RouterisFunction) {
    let callbacks = RouterisFunction
      ? [router]
      : isArray(router.handler)
        ? router.handler
        : [router.handler]
    if (callbacks.length == 0) {
      throw new TypeError('argument handler is required')
    }
    let methods = (router.method || 'get')
      .trim()
      .split(',')
      .map(function toLowerCase(method) {
        return method.toLowerCase() // convert all method to lower case
      })

    // allow all methods
    for (let method of methods) {
      if (!this[method])
        // check method can use
        throw new Error('Not support method ' + method + ' !!!')
      this[method](
        router.path,
        ...callbacks.map(callback => {
          return (...args) => {
            this.BetterHandler(callback, ...args)
          }
        })
      )
    }
  }
  if (isArray(router.children)) {
    // if router has children
    for (let child of router.children) {
      // read all child and set router
      child.path = cleanPath(`${router.path}/${child.path}`) // replace // => /
      this.addRoute(child, path, child.path)
    }
  }
}
