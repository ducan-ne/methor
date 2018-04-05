'use strict'

import methods from './methods-test'

describe('methor.util', () => {
	describe('util.requireall', () => {
		it('it should return object has property logout', done => {
			!!methods['logout'] ? done() : done(new Error('util.requiredall error'))
		})
	})
})
