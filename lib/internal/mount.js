'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (server, port) {
  var _this = this;

  if (!this.isNumber(port) && !this.isNull(port)) throw new TypeError('Invalid port');

  this.$options.port = port;
  server.on('request', function (req, res) {
    _this(req, res, (0, _finalhandler2.default)(req, res));
  });

  return this;
};

var _finalhandler = require('finalhandler');

var _finalhandler2 = _interopRequireDefault(_finalhandler);

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }