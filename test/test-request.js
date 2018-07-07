'use strict'

import server from './create-server'
import assert from 'assert'
import got from 'got'

const expect = expect

function testMethod() {
  describe('method user.login', function() {
    it('should return user login', function() {
      return got('http://0.0.0.0:3004/restserver', {
        query: {
          method: 'user.login',
          username: 'test1',
          password: 'test2'
        }
      }).then(res => {
        assert.equal(res.body, 'user login')
      })
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

describe('test server', function() {
  accessServer()
  testMethod()
})
