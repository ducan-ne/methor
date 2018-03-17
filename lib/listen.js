'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Listen;

var _finalhandler = require('finalhandler');

var _finalhandler2 = _interopRequireDefault(_finalhandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Listen() {
	var opts = this.opts,
	    router = this.router,
	    server = this.server;

	server.listen(opts.port, function () {
		var info = {
			port: opts.port,
			router,
			server
		};
		opts.created && opts.created.bind(info)(info);
	}).on('request', function (req, res) {
		router(req, res, (0, _finalhandler2.default)(req, res));
	});
}