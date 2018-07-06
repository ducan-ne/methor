import Methor from '../lib/methor'
import assert from 'assert'
import got from 'got'
import createServer from './helpers/create-server'
import request from './helpers/request'

describe('methor.inject', () => {
  it('inject angular', async () => {
    const methods = {
      test: {
        login: [
          'req[headers][user-agent]',
          'headers',
          'res',
          function(UA, headers2, res) {
            return { UA, headers2 }
          }
        ]
      }
    }
    const app = await createServer({ methods })
    try {
      const res = await request(app, 'test.login', {}, 'get', {
        headers: {
          'user-agent': 'test header'
        }
      })
      assert.equal(res.body.UA, 'test header')
      assert.equal(res.body.headers2['user-agent'], 'test header')
    } catch (err) {
      throw err
    }
  })
  it('method.$inject', async function() {
    function login(UA, headers2, res) {
      return {
        UA,
        headers2
      }
    }
    login.$inject = ['req[headers][user-agent]', 'headers', 'res']
    const app = await createServer({
      methods: {
        test: {
          login
        }
      }
    })
    try {
      const res = await request(app, 'test.login', {}, 'get', {
        headers: {
          'user-agent': 'test header'
        }
      })
      assert.equal(res.body.UA, 'test header')
      assert.equal(res.body.headers2['user-agent'], 'test header')
    } catch (err) {
      throw err
    }
  })
  it('inject by param name', async function() {
    const methods = {
      test: {
        login: function(headers, res) {
          assert.equal(headers['user-agent'], 'test header')
          assert.equal(typeof res.json, 'function')
          res.end()
        }
      }
    }
    const app = await createServer({ methods })
    try {
      await request(app, 'test.login', {}, 'get', {
        headers: {
          'user-agent': 'test header'
        }
      })
    } catch (err) {
      throw err
    }
  })
})
