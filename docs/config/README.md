---
sidebar: auto
---

# Config Reference

## Basic Config

### pathname

- Type: `string`
- Default: `/restserver`

The path url you will call to it.

Example:

```js
pathname: '/modun'
```

### methods

- Type: `string`
- Required: `true`

Object contain all methods.

**More info:**

- [Method define ways](../guide/method-define-ways.md)
- [Method validate query](../guide/method-plugin-validate.md)

### static

- Type: `string`
- Default: `undefined`
- Require package: `serve-static`

Public path to serve. This will proxy to `serve-static`.

### funcs

- Type: `Object`
- Default: `{}`

Alias call function. For example: `{getUserById: [Function anonymous]}` can call like this

```js
this.getUserById(user.id)
```

While using this style, your method must not be arrow function:

- [More info](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

### routes

- Type: `Array`
- Default: `[]`

Extra routes to be define to router, inspired by `vue-router`, `angular-route`

Each route can be specified in the form:

```ts
type Route = {
  method: string
  path: string(string)
  handler(Function): Function
  children: [Route]
}
```

- Example:

```js
;[
  {
    path: '/test',
    handler(req, res) {
      return {
        ahihi: true
      }
    },
    children: [
      {
        path: '/test1',
        method: 'POST',
        handler() {
          this.this_is_a_func()
          return 'xin chao'
        }
      }
    ]
  }
]
```

### port

- Type: `number`

Specify the port to listen server.

It can be null, the port will be random, same:

```js
http.createServer(onRequest).listen(0, function() {})
```

### plugins

- Type: `Array`
- Default: `[]`

- Provide your plugin to use with `methor`

**Plugin available:**

- [Validator](../plugins/validator)

**To write a plugin:**

- Updating

## API

### app.warn

- Type:

- Arguments:
  `msg(any)`: The message to show in console
  `pluginName(string)`: If you call in plugin, you can define it to plugin name ( Like Validator :D).

- Usage:

```js
app.warn('Hello world from methor', 'Methor Validator')
```

### app.$option

- Arguments
  `path (Array|string)`: The path of property to set $options
  `value (any)`: The value

- Usage:

```js
app.$option('pathname', '/new-restserver')
```

### [app[util\*]](https://github.com/ancm-s/methor//tree/master/src/util/index.js)

Like isString, isFunction, ...

### app.middleware

- Arguments: `...calbacks: Array<Function>`

- Usage:

```js
const cookieParser = require('cookie-parser')
app.middleware(
  cookieParser({
    // some option
  })
)
```

### app.get, app.post, app.all, app.head....

- Arguments:
  `?pathname(string)`
  `handler(Function)`

Feature like express:

```js
app.get(path, (req, res, next) => {})
```

### app.use

- Use a plugin
- Arguments:
  `plugin(Function)`: required
  `options`

```js
app.use(Methor.Validator, {
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

## Mounting

### mount to `Server` object

if you dont need `methor` listen, you can mount `methor` to a `Server` object, like this:

```js
const app = new Methor(options)

http.createServer(app)

//or

http.createServer().on('request', app)
```

## Lifecycle hooks

### beforeEnter

- Type: `Function`
- Default: `undefined`
- Argument: `ServerRequest`, `ServerResponse`, `NextFunction`
- Usage:

```js
new Methor({
  beforeEnter(req, res, next) {
    // do something work
    next()
  }
})
```

It help you write plugin to executed some mini tasks. Like check role:

```js
function removeUser(req,res) {}

removeUser.role = 'admin

beforeEnter(req, res, next) {
  const method = this.method
  if (method.role === 'admin' && req.session.me.role != 'admin') {
    return res.json(
      // something
    )
  }
  next()
}
```

### created

- Type: `Function`
- Default: `undefined`
- Argument: `port`, `server`
- Usage:

```js
new Methor({
  created(port, server) {
    console.log('app started at port %d', port)
  }
})
```

After server listened, `methor` will execute this.

### catchHandler

- Type: `Function`
- Default: `undefined`
- Argument: `err`, `ServerRequest`, `ServerResponse`
- Usage:

```js
new Methor({
  catchHandler(err, req, res) {
    // do something
  }
})
```

Assign a handler for uncaught error during `Methor.handleResponse` work.

## EventEmitter

### method.not.exist

- Type: `Function`
- Argument: `ServerRequest`, `ServerResponse`

Will call if request have a method that not defined

### server.created

- Type: `Function`
- Default: `() => {}`
- Argument: `port`, `server`

Are function which are called when `methor` listened
