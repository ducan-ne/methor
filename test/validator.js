import Methor from '../lib/methor'
import defer from './utils/defer'
import got from 'got'
import assert from 'assert'

function login(req, res) {
  return 'ok'
}

function testValidator() {
  function request(query) {
    return got('http://0.0.0.0:3004/restserver', {
      query: query,
      json: true
    })
  }
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
}

login.validate = {
  username: String
}

const methods = {
  app: { login }
}

const app = new Methor({
  port: null,
  methods
})

defer(() => {
  describe('methor.Validator', () => {
    testValidator()
    it('it should return ok (app.login)', () => {
      return Promise.all([
        got('http://0.0.0.0', {
          path: '/restserver',
          port: app.port,
          query: {
            method: 'app.login',
            username: 'ancms'
          }
        }).then(res => {
          assert.equal(res.body, 'ok')
        })
      ])
    })
  })
})
