# Plugin validator

## Install

```js
const validator = Methor.Validator({
  handler(err) {
    const res = err.response
    if (err.code == 'METHOD_NONEXIST') {
      res.json({
        message: `method ${err.methodName} not found`
      })
    }
    if (err.code == 'INVALID_PARAM') {
      res.json({
        message: `param ${err.validate.name} is invalid`
      })
    }
    if (err.code == 'MISSING_PARAM') {
      res.json({
        message: `param ${err.validate.name} is required`
      })
    }
    if (err.code == 'INVALID_PARAM') {
      res.json({
        message: `param ${err.validate.name} is invalid`
      })
    }
    if (err.code == 'MISSING_METHODNAME') {
      res.json({
        message: 'param method is required'
      })
    }
  }
})
```

## Usage

- Type can be:
  `String`
  `Number`
  `Boolean`
  `Array`
  `Object`
- Options:
  `option(val): boolean`: option validation
  `transform(val): boolean`: transform value after validate, current time not support Promise

  `maxlength: number`: max length of value, support only for `String`
  `minlength: number`: min length of value, support only for `String`
  `lowercase: boolean`: transform value to lower case, support only for `String`
  `uppercase: boolean`: transform value to lower case, support only for `String`
  `trim: boolean`: trim value, support only for `String`
  `regex: RegExp`: test regex value, support only for `String`

  `max: number`: max of value, support only for `Number`
  `min: number`: min of value, support only for `Number`

```js
function Login() {}
Login.validate = [
  {
    name: 'username',
    type: String
  }
]
// or
function Login(req) {
  // req.query.password hashed to md5
}
Login.validate = [
  {
    transform(val) {
      return md5(val)
    },
    name: 'username',
    type: String
  }
]
// or
function Login(req) {}
Login.validate = [
  {
    option(val) {
      return isFloat(val)
    },
    name: 'n'
  }
]
```

## Alias

```js
function Login(req) {}
Login.validate = {
  username: String
}
//or
function Login(req) {}
Login.validate = ['name']
```
