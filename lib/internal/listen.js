'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Listen;

var _finalhandler = require('finalhandler');

var _finalhandler2 = _interopRequireDefault(_finalhandler);

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Listen() {
	if (this.$server_listening) {
		throw new TypeError('cant call this method 2 times');
	}
	var opts = this.opts,
	    router = this.router,
	    server = this.server,
	    isNull = this.isNull;

	var args = [opts.port || process.env.PORT, function () {
		var info = {
			port: opts.port && !isNull(opts.port) ? opts.port : server.address().port,
			router,
			server
		};
		opts.created && opts.created.bind(info)(info);
	}];
	if (!args[0] || args[0] == null) {
		args.shift();
	}

	if (!(server instanceof _http.Server)) throw new TypeError('options.server must be abstract of http.Server');

	this.$server_listening = true;
	server.listen.apply(server, args).on('request', function (req, res) {
		router(req, res, (0, _finalhandler2.default)(req, res));
	});
}