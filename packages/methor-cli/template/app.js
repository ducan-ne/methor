var Methor = require('methor')

var app = new Methor({
  port: process.env.PORT || 8080,
  methods: require('./methods'),
  <% if(options.plugins.length > 0) { %>plugins: [
      <%if (~options.plugins.indexOf('validator')) {%>Methor.Validator({
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
      })<%}%>
  ],<%}%>
  created(port) {
    console.log('app started at port %d', port)
  }
})