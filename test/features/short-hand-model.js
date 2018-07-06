import assert from 'assert'

import createServer from '../helpers/create-server'
import request from '../helpers/request'

describe('shorthand Model', function() {
  it('should can be use in method', async function() {
    const methods = {
      test: {
        test: function(User) {
          return { User }
        }
      }
    }
    const services = { User: { ancms: '123' } }
    let instance = await createServer({ methods, services })
    try {
      let response = await request(instance, 'test.test')
      let body = response.body
      assert.equal(typeof body.User, 'object')
      assert.equal(typeof body.User.ancms, 'string')
      assert.equal(body.User.ancms, '123')
    } catch (err) {
      throw err
    }
  })
})
