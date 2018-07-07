// updating

import assert from 'assert'
import createServer from '../helpers/create-server'
import request from '../helpers/request'

describe('betterHandler.ctx', function() {
  let instance = createServer({
    services: {
      User: {
        ancms: '123'
      }
    },
    funcs: {
      HelloWorld() {
        return 'hello world'
      }
    },
    methods: {
      test() {
        assert.equal(typeof this.method, 'function')
        assert.equal(typeof this.setHeader, 'function')
        assert.equal(typeof this.userAgent, 'string')
        assert.equal(typeof this.headers, 'object')
        assert.equal(typeof this.User, 'object')
        assert.equal(this.User.ancms, '123')
        assert.equal(typeof this.HelloWorld, 'function')
        assert.equal(this.HelloWorld(), 'hello world')
        assert.equal(typeof this.req, 'object')
        assert.equal(typeof this.req.headers, 'object')
        assert.equal(typeof this.res, 'object')
        assert.equal(typeof this.res.json, 'function')
        delete this.req // circular
        delete this.res // circular
        return this
      }
    }
  })
  it('this.body should not undefined', async function() {
    const app = await instance
    try {
      const res = await request(app, 'test')
      assert.equal(typeof res.body.body, 'object')
    } catch (err) {
      // console.log(err.response.body)
      throw err
    }
  })
  it('this.query should not undefined', async function() {
    const app = await instance
    try {
      const res = await request(app, 'test', { clgt: 'io' })
      assert.equal(typeof res.body.query, 'object')
      assert.equal(res.body.query.clgt, 'io')
    } catch (err) {
      throw err
    }
  })
  it('this.method should not undefined', async function() {
    const app = await instance
    try {
      const res = await request(app, 'test')
      assert.equal(typeof res.body.methodName, 'string')
    } catch (err) {
      throw err
    }
  })
  it('this.$options should not undefined', async function() {
    const app = await instance
    try {
      const res = await request(app, 'test')
      assert.equal(typeof res.body.$options, 'object')
    } catch (err) {
      throw err
    }
  })
})
