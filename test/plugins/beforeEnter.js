import assert from 'assert'
import createServer from '../helpers/create-server'
import request from '../helpers/request'

describe('Plugin.BeforeEnter', function() {
  it('should can use perfect', async function() {
    const TestPlugin = function() {
      assert.equal(typeof this.beforeEnter, 'function')
      this.beforeEnter(function(req, res, next) {
        assert.equal(typeof this.method, 'function')
        assert.equal(typeof this.methodName, 'string')
        assert.equal(typeof req.headers, 'object')
        next()
      })
    }
    const plugins = [TestPlugin]
    const instance = await createServer({
      plugins,
      methods: {
        test() {
          return ['123']
        }
      }
    })
    try {
      const res = await request(instance, 'test')
      assert.equal(res.body[0], '123')
    } catch (err) {
      throw err
    }
  })
  it('should stop in before enter', async function() {
    const TestPlugin = function() {
      assert.equal(typeof this.beforeEnter, 'function')
      this.beforeEnter((req, res, next) => {
        assert.equal(typeof req.headers, 'object')
        return ['stop']
      })
    }
    const plugins = [TestPlugin]
    const instance = await createServer({
      plugins,
      methods: {
        test() {
          return ['123']
        }
      }
    })
    try {
      const res = await request(instance, 'test')
      assert.equal(res.body[0], 'stop')
    } catch (err) {
      throw err
    }
  })
})
