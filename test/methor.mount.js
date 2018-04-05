'use strict'

import Methor from '../lib/methor'
import assert from 'assert'
import got from 'got'
import get from 'lodash.get'
import { Server } from 'http'

describe('methor.mount', () => {
	const server = new Server()
	it('it should create server', done => {
		new Methor({
			methods: {},
			routes: [
				{
					path: '/',
					router() {
						done()
						return 'ancms'
					}
				}
			],
			created({ port }) {
				got('http://0.0.0.0:' + port).catch(done)
			}
		}).$mount(server, null)
	})
})
