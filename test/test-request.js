'use strict'

import server from './create-server'
import assert from 'assert'
import got from 'got'

const expect = expect

function testMethod() {
	describe('method user.login', function() {
		it('should return user login', function(done) {
			got('http://0.0.0.0:3004/restserver', {
				query: {
					method: 'user.login',
					username: 'test1',
					password: 'test2'
				}
			})
				.then(res => {
					assert.equal(res.body, 'user login')
					done()
				})
				.catch(done)
		})
	})
}

function accessServer() {
	describe('GET /', function() {
		it('should return 200', done => {
			got('http://0.0.0.0:3004').then(res => {
				assert.equal(res.statusCode, 200)
				done()
			})
		})
	})
}

function testValidator() {
	function request(query) {
		return got('http://0.0.0.0:3004/restserver', {
			query: query,
			json: true
		})
	}
	describe('Methor.Validator', () => {
		it('should return method not found', function(done) {
			request({
				method: 'user.loginx'
			})
				.then(res => {
					assert.equal('object', typeof res.body)
					assert.equal('method user.loginx not found', res.body.message)
					done()
				})
				.catch(done)
		})
		it('should return missing param', function(done) {
			request({
				method: 'user.test'
			})
				.then(res => {
					assert.equal(res.body.message, 'param num is required')
					done()
				})
				.catch(done)
		})
		it('should return invalid param', function(done) {
			request({
				method: 'user.test',
				num: 'this is a string'
			})
				.then(res => {
					assert.equal(res.body.message, 'param num is invalid')
					done()
				})
				.catch(done)
		})
	})
}

describe('test server', function() {
	accessServer()
	testMethod()
	testValidator()
})
