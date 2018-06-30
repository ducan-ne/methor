'use strict'

const Methor = require('../src/methor')
const path = require('path')

const user = {
  login: require('./methods/login'),
  logout: require('./methods/logout')
}

const http = require('http')

const app = new Methor({
  // pathname: '/ancms',
  // static: path.resolve(__dirname, '.', 'public'),
  port: 3002,
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
    this_is_a_func() {}
  },
  routes: [
    {
      path: '/test',
      router(req, res) {
        return {
          ahihi: true
        }
      },
      children: [
        {
          path: '/test1',
          method: 'POST',
          router() {
            this.this_is_a_func()
            return 'xin chao'
          }
        }
      ]
    }
  ],
  created(port, server) {
    console.log('app started at port %d', port)
    this.get('/logout', (req, res) => {
      res.end('ahihi do ngok')
    })
  },
  plugins: [
    Methor.Validator({
      handler(err) {
        const res = err.response
        if (err.code == 'METHOD_NONEXIST') {
          res.json({
            message: `method ${err.methodName} not found`
          })
        }
        if (err.code == 'INVALID_PARAM') {
          res.json({
            message: `param ${err.validate.name} is invalid`
          })
        }
        if (err.code == 'MISSING_PARAM') {
          res.json({
            message: `param ${err.validate.name} is required`
          })
        }
        if (err.code == 'INVALID_PARAM') {
          res.json({
            message: `param ${err.validate.name} is invalid`
          })
        }
        if (err.code == 'MISSING_METHODNAME') {
          res.json({
            message: 'param method is required'
          })
        }
      }
    })
  ]
})

app.get('/', (req, res) => res.end('123'))

// app.$on('server.created', console.log)

// app.$option('pathname', '/restserver2')

// http.createServer(app).listen(3002, console.log.bind(console, 'app started'))

// curl http://localhost:3004/restserver2?method=user.login
