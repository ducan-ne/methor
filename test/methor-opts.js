'use strict'

import assert from 'assert'
import Methor from '../lib/methor'
import createServer from './helpers/create-server'
import request from './helpers/request'

const routes = [
  {
    path: '/test',
    handler(req, res) {
      return {
        ahihi: true
      }
    },
    children: [
      {
        path: '/test1',
        method: 'POST',
        handler() {
          return { msg: 'xin chao' }
        }
      }
    ]
  }
]

describe('methor.MethorOptions', function() {
  describe('created hook', function() {
    it('should called', done => {
      new Methor({
        port: null,
        methods: {},
        created() {
          done()
        }
      })
    })
  })
  describe('#routes', function() {
    it('should return response when access router', async () => {
      const app = await createServer({ routes })
      try {
        const res = await request(app, '/test/test1', {}, 'post')
        const res2 = await request(app, '/test')
        assert.equal(res.body.msg, 'xin chao')
        assert.equal(res2.body.ahihi, true)
      } catch (err) {
        throw err
      }
    })
  })
})
