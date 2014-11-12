var utils   = require('./utils');
var extend  = require('util')._extend;
var swig    = require('swig');
var authTpl = swig.compileFile(__dirname + '/../views/auth-content.html');
var lockTpl = swig.compileFile(__dirname + '/../views/lock-content.html');



exports.test = function(req, res, next) {
	var login = req.cookies.login;
	var hash  = req.cookies.hash;

	if (req.options.noAuth) {
		next();
	} else {
		// Данные с формы
		if ((!hash || !login) && req.body.login && req.body.password && req.options.users[req.body.login]) {
			if (utils.sha512(req.body.password) === req.options.users[req.body.login].hash) {
				login = req.body.login;
				if (req.body.remember) {
					res.cookie('remember', '1', { maxAge: 3 * utils.YEAR, path: req.options.baseUrl});
					req.cookies.remember = true;
				} else {
					res.clearCookie('remember');
					req.cookies.remember = false;
				}
				hash  = utils.md5(req.options.users[login].hash + req.body.login + 'slt');
			}
		}

		if (login && hash && req.options.users[login] && checkLogin(login, hash, req.options.users[login])) {
			req.options.user = extend({login: login}, req.options.users[login]);
			res.cookie('login', login, { maxAge: 3 * utils.YEAR, path: req.options.baseUrl});
			res.cookie('hash', hash,  req.cookies.remember ? { maxAge: 3 * utils.YEAR, path: req.options.baseUrl} : {path: req.options.baseUrl});
			next();
		} else if (login && req.options.users[login]) {
			res.clearCookie('hash', {path: req.options.baseUrl});
			var settings = req.options.users[login];
			req.options.login = login;
			req.options.userpic = settings.userpic || parseInt( Math.random() * 19 + 1, 10);
			render_lock (req, res, next);
		} else {
			res.clearCookie('hash', {path: req.options.baseUrl});
			render_auth (req, res, next);
		}
	}
};


function render_auth (req, res, next) {
	// res.render(authTpl(), "auth");
	res.render(__dirname + '/../views/auth-content.html', {}, 'auth');
	next();
}

function render_lock (req, res, next) {
	res.render(__dirname + '/../views/lock-content.html', {
		login: req.options.login,
		remember: req.cookies.remember,
		userpic: req.options.userpic,
		staticUrl: req.options.staticUrl
	}, 'auth', {showDropMenu: true, login: req.options.login});

	next();
}


function checkLogin(login, hash, settings) {
	return utils.md5(settings.hash + login + 'slt') === hash;
}