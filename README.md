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
'use strict'

const Methor = require('../src/methor')
const path = require('path')

const user = {
	login: require('./methods/login'),
	logout: require('./methods/logout')
}

const app = new Methor({
	// _restserverPath: '/ancms',
	// static: path.resolve(__dirname, '.', 'public'),
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
		this_is_a_func() {}
	},
	routes: [
		{
			path: '/test',
			router(req, res) {
				return {
					ahihi: true
				}
			},
			children: [
				{
					path: '/test1',
					method: 'POST',
					router() {
						this.this_is_a_func()
						return 'xin chao'
					}
				}
			]
		}
	],
	created({ port, router }) {
		console.log('app started at port %d', port)
		router.get('/logout', (req, res) => {
			res.end('ahihi do ngok')
		})
	},
	plugins: [
		Methor.Validator({
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
			}
		})
	]
})
  .$on('request', (req, res) => {
  	console.log('request coming')
  })
  .get('/', (req, res) => {
  	res.end('=)')
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
