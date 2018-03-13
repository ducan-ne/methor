'use strict'

const Methor = require('./')

new Methor({
  // _restserverPath: '/ancms',
  port: 3004,
  methods: {
    login(req, res) {
      res.end('hello world')
    }
  },
  funcs: {
  },
  routes: {
    '/': function() {
      const {end} = this
      end('ahihi')
      return
    }
  },
  created({port, router}) {
    console.log('app started at port %d', port)
    router.get('/logout', (req, res) => {
      res.end('ahihi do ngok')
    })
  }
})
  .init()
