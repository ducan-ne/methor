'use strict'

import Methor from '../lib/methor'
import assert from 'assert'
import got from 'got'
import get from 'lodash.get'

describe('methor.inject', () => {
	it('inject angular', done => {
		new Methor({
			port: null,
			methods: {
				test: {
					login: [
						'req[headers][user-agent]',
						'headers',
						'res',
						function(UA, headers2, res) {
							assert.equal(UA, 'test header')
							assert.equal(headers2['user-agent'], 'test header')
							assert.equal(typeof res.json, 'function')
							done()
							res.end()
						}
					]
				}
			},
			created({ port }) {
				got('http://0.0.0.0:' + port, {
					path: '/restserver',
					query: { method: 'test.login' },
					headers: {
						'user-agent': 'test header'
					}
				}).catch(done)
			}
		})
	})
	it('inject by param name', done => {
		new Methor({
			port: null,
			methods: {
				test: {
					login: function(headers, res) {
						assert.equal(headers['user-agent'], 'test header')
						assert.equal(typeof res.json, 'function')
						done()
						res.end()
					}
				}
			},
			created({ port }) {
				got('http://0.0.0.0:' + port, {
					path: '/restserver',
					query: { method: 'test.login' },
					headers: {
						'user-agent': 'test header'
					}
				}).catch(done)
			}
		})
	})
})
