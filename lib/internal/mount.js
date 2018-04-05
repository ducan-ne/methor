'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (server, port) {
  if (!this.isNumber(port) && !this.isNull(port)) throw new TypeError('invalid typename port');

  this.opts.port = port;
  this.server = server;
  this.listen();

  return this;
};