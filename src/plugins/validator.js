// @flow

import get from 'lodash.get'
import set from 'lodash.set'
import chalk from 'chalk'
import type { HttpResponse, HttpRequest } from '../types'

type Validate = {
  name: string,
  type: any,
  regex?: RegExp,
  option?: Function,
  max?: number,
  min?: number,
  transform?: Function,
  subcode?: number,
  trim?: boolean,
  maxlength?: number,
  uppercase?: boolean,
  lowercase?: boolean,
  minlength?: number
}

type ValidateOpts = {
  handler(err: ValidateError): void,
  by?: Function,
  payload?: Function,
  setPayload?: Function
}

function ValidateError(
  method: Function,
  methodName: string,
  code: string,
  subcode?: string,
  req: HttpRequest,
  res: HttpResponse,
  validate
) {
  this.name = 'ValidateError'
  this.code = code
  this.subcode = subcode
  this.request = req
  this.response = res
  this.methodName = methodName
  this.method = method
  this.validate = validate
  this.stack = new Error().stack
  Error.captureStackTrace(this)
}

ValidateError.prototype = Object.create(Error.prototype)
ValidateError.prototype.constructor = ValidateError

const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n)

export default function(opts: ValidateOpts) {
  return function install() {
    if (!opts.handler) throw new TypeError('opts.handler is required')
    const {
      isRegexp,
      isFunction,
      isUndef,
      isArray,
      isString,
      isObject,
      warn
    } = this
    this.beforeEnter(function(
      req: HttpRequest,
      res: HttpResponse,
      next: Function
    ) {
      const method = req._method
      const methodName = req.methodName

      const handlerError = (
        code: string,
        validate: ?Validate,
        subcode?: string
      ) => {
        setTimeout(() => {
          if (!res.finished) {
            warn(
              'Seem like you have not handler for code ' + chalk.cyan(code),
              'Validator'
            )
          }
        }, 5e3)
        opts.handler(
          new ValidateError(
            method,
            methodName,
            code,
            subcode,
            req,
            res,
            validate
          )
        )
      }

      if (!methodName) {
        return handlerError('MISSING_METHODNAME')
      }

      if (!method) {
        return handlerError('METHOD_NONEXIST')
      }

      if (method.__validate) {
        method.validate = method.__validate
      }

      if (!method.validate) return next()

      let params, isPayload

      try {
        if (opts.by && typeof opts.by === 'function') {
          params = opts.by(req, res)
          if (!params) throw new Error()
        } else if (
          method.validate &&
          method.validate.__type &&
          method.validate.__type == 'payload'
        ) {
          params =
            typeof opts.payload === 'function'
              ? opts.payload(req, res)
              : JSON.parse(req.query.payload)
          isPayload = true
        } else {
          params = req.query
          isPayload = false
        }
      } catch (err) {
        return handlerError('INVALID_PAYLOAD')
      }

      const stack: Array<Validate> = []

      /**
       * Parse a validate object
       *
       * Possiable cases:
       *  - {test?: String}
       *  - {test: {type: String}}
       *  - [{type: String, name: 'test}]
       *  - ['test']
       *  - () => *
       *
       * */

      if (isFunction(method.validate)) {
        method.validate = method.validate() || {}
      }

      if (isObject(method.validate)) {
        for (let k in method.validate) {
          let opt = method.validate[k]
          stack.push(
            Object.assign({ name: k, type: String }, isObject(opt) ? opt : {})
          )
        }
      }
      if (isArray(method.validate)) {
        for (let validate of method.validate) {
          if (isString(validate)) {
            stack.push({
              type: String,
              name: validate
            })
          } else {
            stack.push(validate)
          }
        }
      }

      for (let validate of stack) {
        const {
          regex,
          option,
          max,
          min,
          transform,
          trim = false,
          type = String,
          maxlength,
          uppercase = false,
          lowercase = false,
          minlength
        } = validate
        let param = get(params, validate.name)
        if (isUndef(param)) return handlerError('MISSING_PARAM', validate)

        // String
        if (type == String) {
          if (trim === true) {
            set(params, validate.name, param.trim())
          }
          if (regex && isRegexp(regex) && !regex.test(param)) {
            return handlerError('INVALID_PARAM', validate, 'TEST_FAIL_REGEX')
          }
          if (!param || param == '' || param == null) {
            return handlerError('INVALID_PARAM', validate, 'EMPTY_PARAM')
          }
          if (param.length) {
            if (minlength && param.length < minlength) {
              return handlerError('INVALID_PARAM', validate, 'MIN_LENGTH')
            }
            if (maxlength && param.length > maxlength) {
              return handlerError('INVALID_PARAM', validate, 'MAX_LENGTH')
            }
          }
          set(params, validate.name, param.toString())
          if (uppercase) {
            set(params, validate.name, param.toUpperCase())
          }
          if (lowercase) {
            set(params, validate.name, param.toLowerCase())
          }
        }

        // Number
        if (type == Number) {
          if (!isNumber(param)) {
            return handlerError('INVALID_PARAM', validate)
          }
          if (min && min < param) {
            return handlerError('INVALID_PARAM', validate, 'NUMBER_MIN')
          }
          if (min && param > max) {
            return handlerError('INVALID_PARAM', validate, 'NUMBER_MAX')
          }
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

        if (option && isFunction(option)) {
          let result = option.bind(
            Object.assign(params, {
              isNumber
            })
          )(param)
          if (isUndef(result) || result != true) {
            return handlerError('INVALID_PARAM', validate)
          }
        }
        if (transform && isFunction(transform)) {
          set(params, validate.name, transform(param))
        }
      }

      if (isPayload) {
        const isPayloadBody = Object.keys(req.body).length > 0
        if (typeof opts.setPayload == 'function') {
          opts.setPayload(req, params)
        } else {
          if (isPayloadBody) {
            req.body.payload = params
          } else {
            req.query.payload = params
          }
        }
      }

      next()
    })
  }
}
