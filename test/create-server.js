'use strict'

import Methor from '../lib/methor'
import path from 'path'

const user = {
	login: require('../example/methods/login'),
	logout: require('../example/methods/logout'),
	test: require('./methods-test/user.test')
}

export default new Methor({
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
	.get('/', (req, res) => {
		res.end('??')
	})
