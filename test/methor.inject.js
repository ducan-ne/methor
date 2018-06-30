'use strict'

import regeneratorRuntime from 'regenerator-runtime'

import Methor from '../lib/methor'
import assert from 'assert'
import got from 'got'

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
              console.log(UA)
              return { UA, headers2 }
            }
          ]
        }
      },
      async created(port) {
        const res = await got('http://0.0.0.0:' + port, {
          path: '/restserver',
          query: { method: 'test.login' },
          headers: {
            'user-agent': 'test header'
          },
          json: true
        })
        assert.equal(res.body.UA, 'test header')
        assert.equal(res.body.headers2['user-agent'], 'test header')
        done()
      }
    })
  })
  it('method.$inject', done => {
    function login(UA, headers2, res) {
      return {
        UA,
        headers2
      }
    }
    login.$inject = ['req[headers][user-agent]', 'headers', 'res']
    new Methor({
      port: null,
      methods: {
        test: {
          login
        }
      },
      async created(port) {
        const res = await got('http://0.0.0.0:' + port, {
          path: '/restserver',
          query: { method: 'test.login' },
          headers: {
            'user-agent': 'test header'
          },
          json: true
        })
        assert.equal(res.body.UA, 'test header')
        assert.equal(res.body.headers2['user-agent'], 'test header')
        done()
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
      created(port) {
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
