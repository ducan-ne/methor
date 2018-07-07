import assert from 'assert'
import createServer from '../helpers/create-server'
import request from '../helpers/request'

import Methor from '../../lib/methor'

const test1 = Methor.createMethod('ancms.sample', function(req) {
  return { headers: req.headers }
})

const test2 = Methor.createMethod(function(req) {
  return { headers: req.headers }
})
test2.validate({
  ancms: String
})

const methods = {
  test1,
  test2
}

const validator = Methor.Validator({
  handler(err) {
    const res = err.response
    if (err.code == 'MISSING_PARAM') {
      res.json({ message: `method not found` })
    }
  }
})

describe('Methor.createMethod', function() {
  const instance = createServer({ methods, plugins: [validator] })
  it('should set name method to ancms.sample', async function() {
    const app = await instance
    try {
      let res = await request(app, 'ancms.sample')
      assert.equal(typeof res.body.headers, 'object')
      assert.equal(typeof res.body.headers['user-agent'], 'string')
    } catch (err) {
      throw err
    }
  })
  it('should validate failed', async function() {
    const app = await instance
    try {
      let res = await request(app, 'test2')
      assert.equal(typeof res.body, 'object')
      assert.equal(res.body.message, 'method not found')
    } catch (err) {
      throw err
    }
  })
  it('should validate success', async function() {
    const app = await instance
    try {
      let res = await request(app, 'test2', {
        ancms: 'sample string'
      })
      assert.equal(typeof res.body.headers, 'object')
      assert.equal(typeof res.body.headers['user-agent'], 'string')
    } catch (err) {
      throw err
    }
  })
})
