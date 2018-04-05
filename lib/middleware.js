'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Middleware;

var _url = require('url');

function Middleware(req, res, next) {
	var query = req.query = (0, _url.parse)(req.url, true).query;

	res.json = function json(obj, pretty) {
		res.setHeader('Content-Type', 'application/json;charset=utf8');
		res.end(pretty == true ? JSON.stringify(obj, null, 4) : JSON.stringify(obj));
	};

	res.redirect = function redirect(uri, statusCode) {
		res.statusCode = statusCode || 322;
		res.setHeader('Location', uri);
		res.end();
	};

	req.class = query.method ? query.method.split('.')[0] : false;

	next();
}