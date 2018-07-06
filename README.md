<p align="center">
	<h2>Methor</h2>
</p>
<p align="center">
	<a href="https://npmjs.org/package/methor" target="_blank"><img src="https://img.shields.io/npm/v/methor.svg" alt="NPM"/></a>
	<a href="https://npmjs.org/package/methor"><img src="https://img.shields.io/npm/dm/methor.svg" alt="download"/></a>
  <a href="https://npmjs.org/package/methor"><img src="https://img.shields.io/npm/l/methor.svg" alt="License"></a>
</p>

Nodejs web application framework inspired by Facebook API

http://methor.clgt.io

[`Example`](https://github.com/ancm-s/methor/tree/master/example)

## Install

```bash
$ npm install methor --save
```

## USAGE

```js
const Methor = require('methor')
const path = require('path')
const app = new Methor({
  port: 3004,
  methods: {
    user
  },
  created(port, server) {
    console.log('app started at port %d', port)
    this.get('/logout', (req, res) => {
      res.end('ahihi do ngok')
    })
  }
})
// app.get, app.post, ... many features
// curl http://localhost:3004/restserver?method=user.login
```
