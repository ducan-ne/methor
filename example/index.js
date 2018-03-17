'use strict'

const Methor = require('../src/methor')
const path = require('path')

const user = {
  login: require('./methods/login'),
  logout: require('./methods/logout'),
}

const methor = new Methor({
  // _restserverPath: '/ancms',
  // static: path.resolve(__dirname, '.', 'public'),
  port: 3004,
  methods: {
    user
  },
  services: {
    User: {
      login(username, pwd) {
        return // check
      }
    }
  },
  funcs: {
    this_is_a_func(){}
  },
  routes: [{
    path: '/test',
    router(req, res) {
      return {
        ahihi: true
      }
    },
    children: [{
      path: '/test1',
      method: 'POST',
      router() {
        this.this_is_a_func()
        return 'xin chao'
      }
    }]
  }],
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
