## Intro

- Method style inspired by `angular`

- First, we have useful parameter. It will pass smartly to method
- We can get a service from parameter
- Parameter can be nested path

- Below here is the guide on ways that we can define function

## define simple

```js
function Login(req, res, next) {}
// or
function Login(res, req, next) {}
function Login(res, next, res) {}
// or
function Login(res, User) {}
```

## define by Array

- `array[array.length-1]` would be handler
- `array.slice(-1, array.length)` would be parameter

```js
const Login = ['req', 'res', function(req, res) {}]
// or
const Login = [
  'req',
  'req.headers',
  'res',
  'next',
  function(req, headers, res, done) {
    // done or anyname that you like
  }
]
// or
const Login = ['req', 'User', function(req, User) {}]
// or
const Login = ['req', 'User', function(req, Userxxx) {}]
```

## define by $inject

- `method.$inject` would be parameter

```js
function Login(req, headers, resp, User) {}
Login.$inject = ['req', 'req.headers', 'res', 'User']
```

## define by Methor.createMethod

- `method.$inject` would be parameter

```js
const Methor = require('methor')
const Login = Methor.createMethod(handler)
// or
const Login = Methor.createMethod(name, handler)

Login.mark() // redefine name of Login

Login.validate(obj) // alias for Validator plugin
```
