# methor

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]

a router style restserver - method


## Install

```bash
$ npm install methor --save
```

# USAGE
```js
'use strict'

const Methor = require('methor')
const path = require('path')

const user = {
  login: require('./methods/login'),
  logout: require('./methods/logout'),
}

const methor = new Methor({
  port: 3004,
  methods: {
    user
  },
  services: {
    User: {
      login(username, pwd) {
        return // check
      }
    }
  },
  funcs: {
    this_is_a_func(){}
  },
  routes: [{
    path: '/test',
    router(req, res) {
      return {
        ahihi: true
      }
    },
    children: [{
      path: '/test1',
      method: 'POST',
      router() {
        this.this_is_a_func()
        return 'xin chao'
      }
    }]
  }],
  created({port, router}) {
    console.log('app started at port %d', port)
    router.get('/logout', (req, res) => {
      res.end('ahihi do ngok')
    })
  }
})
  .$on('request', (req, res) => {
    console.log('request coming')
  })
  .get('/', (req, res) => {
    res.end(':D')
  })
// curl http://localhost:3004/restserver?method=user.login

```

### Methor(options)

return Abstract of `http.Server`

Options


[npm-image]: https://img.shields.io/npm/v/methor.svg
[npm-url]: https://npmjs.org/package/methor
[node-version-image]: https://img.shields.io/node/v/methor.svg
[node-version-url]: http://nodejs.org/download/
[downloads-image]: https://img.shields.io/npm/dm/methor.svg
[downloads-url]: https://npmjs.org/package/methor
