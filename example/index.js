'use strict'

const Methor = require('../src/methor')
const path = require('path')

const user = {
	login: require('./methods/login'),
	logout: require('./methods/logout')
}

// import {Server} from 'http'


const app = new Methor({
	// _restserverPath: '/ancms',
	// static: path.resolve(__dirname, '.', 'public'),
	port: null,
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
				if (err.code == 'MISSING_METHODNAME') {
					res.json({
						message: 'param method is required'
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
	res.end('??')
})
// curl http://localhost:3004/restserver?method=user.login
