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
