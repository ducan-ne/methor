import { isFunction, isString, setPropertyOf } from '../util'

// @flow

function proxy(to, from, names) {
  for (let name of names) {
    Object.defineProperty(to, name, {
      get() {
        console.log(from[name])
        return typeof from[name] === 'function'
          ? from[name].bind(from)
          : from[name]
      }
    })
  }
}

function Method(name: Function | string, handler?: Function): Function {
  if (isFunction(name)) {
    handler = name
  }
  handler.__name = undefined
  handler.__validate = {}
  function MethorObject() {
    return handler(...arguments)
  }
  MethorObject.toString = () => handler.toString()
  MethorObject.validate = function(obj) {
    MethorObject.__validate = obj
  }
  MethorObject.mark = function(name) {
    MethorObject.__name = name
  }
  if (isString(name)) {
    MethorObject.mark(name)
  }
  return MethorObject
}

// class Method {
//   handler: Function
//   constructor(name: Function | string, handler?: Function): Function {
//     if (isFunction(name)) {
//       handler = name
//     }
//     this.handler = handler
//     this.handler.__name = undefined
//     this.handler.__validate = {}

//     const that = this
//     function MethorObject() {
//       return that.handler(...arguments)
//     }
//     // setPropertyOf(MethorObject, this)
//     proxy(MethorObject, this.handler, ['__name', '__validate'])
//     MethorObject.validate = this.validate
//     MethorObject.mark = this.mark
//     if (isString(name)) {
//       this.mark(name)
//     }

//     return MethorObject
//   }

//   mark(newName: string): void {
//     this.handler.__name = newName
//   }

//   validate(object: Object): void {
//     this.handler.__validate = object
//   }
// }

export default function() {
  return new Method(...arguments)
}
