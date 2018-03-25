# methor

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]

a router style restserver - method

[`Example`](https://github.com/ancm-s/methor/tree/master/example)


## Install

```bash
$ npm install methor --save
```

# USAGE
```js
const Methor = require('methor')
const path = require('path')
const app = new Methor({
	port: 3004,
	methods: {
		user
	},
	created({ port, router }) {
		console.log('app started at port %d', port)
		router.get('/logout', (req, res) => {
			res.end('ahihi do ngok')
		})
	},
})
// curl http://localhost:3004/restserver?method=user.login

```

### new Methor(options)

return an instance of `http.Server`

Options

###### port

Type: `Number`
Default `80`

###### methods

Type: `Object`
Required: `true`

##### services

Type: `Object`

##### plugins

Type: `Array`

##### plugins

Type: `Object`

##### static

Type: `String`
Require package: `serve-static`

##### created

Type: `Function`




[npm-image]: https://img.shields.io/npm/v/methor.svg
[npm-url]: https://npmjs.org/package/methor
[node-version-image]: https://img.shields.io/node/v/methor.svg
[node-version-url]: http://nodejs.org/download/
[downloads-image]: https://img.shields.io/npm/dm/methor.svg
[downloads-url]: https://npmjs.org/package/methor
