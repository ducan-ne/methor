import assert from 'assert'
import createServer from '../helpers/create-server'
import request from '../helpers/request'

describe('Plugin.BeforeHandleResponse', function() {
  it('should can use perfect', async function() {
    const TestPlugin = function() {
      assert.equal(typeof this.beforeHandleResponse, 'function')
      this.beforeHandleResponse((result, next, req, res) => {
        assert.equal(typeof req.headers, 'object')
        assert.equal(typeof res.json, 'function')
        assert.equal(typeof next, 'function')
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
  it('should have new type handler', async function() {
    const TestPlugin = function() {
      this.beforeHandleResponse((result, next, req, res) => {
        assert.equal(typeof req.headers, 'object')
        if (
          this.isObject(result.value) &&
          result.value.__file &&
          result.value.__file === 'ancms.html'
        ) {
          // fake send file
          result.value = '<html></html>'
        }
        next()
      })
    }
    const plugins = [TestPlugin]
    const instance = await createServer({
      plugins,
      methods: {
        test() {
          return {
            __file: 'ancms.html'
          }
        }
      }
    })
    try {
      const res = await request(instance, 'test')
      assert.equal(res.body, '<html></html>')
    } catch (err) {
      throw err
    }
  })
  it('should stop in before handle response', async function() {
    const TestPlugin = function() {
      this.beforeHandleResponse((result, next, req, res) => {
        assert.equal(typeof req.headers, 'object')
        res.json(['stop'])
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
