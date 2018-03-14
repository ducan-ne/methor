# methor

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

a router style restserver - method


## Install

```bash
$ npm install methor --save
```

# USAGE
```js
const Methor = require('methor')

new Methor({
  port: 3004,
  methods: {
    login(req, res) {
      res.end('hello world')
    }
  },
  created({port}) {
    console.log('app started at port %d', port)
  }
})
  .init()
```

### Methor(options)

return abstract of ```Router```

Options


[npm-image]: https://img.shields.io/npm/v/methor.svg
[npm-url]: https://npmjs.org/package/methor
[node-version-image]: https://img.shields.io/node/v/methor.svg
[node-version-url]: http://nodejs.org/download/
[travis-image]: https://img.shields.io/travis/pillarjs/methor/master.svg
[travis-url]: https://travis-ci.org/pillarjs/methor
[coveralls-image]: https://img.shields.io/coveralls/pillarjs/methor/master.svg
[coveralls-url]: https://coveralls.io/r/pillarjs/methor?branch=master
[downloads-image]: https://img.shields.io/npm/dm/methor.svg
[downloads-url]: https://npmjs.org/package/methor
