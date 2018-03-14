'use strict'

const Methor = require('../')

const user = {
  login: require('./methods/login'),
  logout: require('./methods/logout'),
}

const methor = new Methor({
  // _restserverPath: '/ancms',
  port: 3004,
  methods: {
    user
  },
  funcs: {
  },
  routes: {
    '/': function() {
      return {
        ahihi: true
      }
    }
  },
  created({port, router}) {
    console.log('app started at port %d', port)
    router.get('/logout', (req, res) => {
      res.end('ahihi do ngok')
    })
  }
})
  .$on('request', (req, res) => {
    console.log('request coming')
  })
  .get('/', (req, res) => {
    res.end('??')
  })
// curl http://localhost:3004/restserver?method=user.login
