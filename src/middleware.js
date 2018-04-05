'use strict'

import { parse } from 'url'

export default function Middleware(req, res, next) {
	const query = (req.query = parse(req.url, true).query)

	res.json = function json(obj, pretty) {
		res.setHeader('Content-Type', 'application/json;charset=utf8')
		res.end(pretty == true ? JSON.stringify(obj, null, 4) : JSON.stringify(obj))
	}

	res.redirect = function redirect(uri, statusCode) {
		res.statusCode = statusCode || 322
		res.setHeader('Location', uri)
		res.end()
	}

	req.class = query.method ? query.method.split('.')[0] : false

	next()
}
