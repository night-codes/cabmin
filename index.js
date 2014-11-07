var app    = require('orangebox').app();
var extend = require('util')._extend;
var utils  = require('./controllers/utils');
var path   = require('path');

module.exports.init = function(opt) {

	var router = app.Router();
	router.options = extend({
		title: 'Cabmin',
		baseUrl: '/cabmin',
		staticUrl: '/cabmin/files',
		mainPage: '/',
		syntax: 'xcode',
		users: {},
		path: path.resolve() + '/cabmin',
		menu: [],
		noAuth: false,
		loadDefaults: true
	}, opt);
	router.options.home = opt.home || router.options.baseUrl + router.options.mainPage;


	app.fileServer(__dirname, '/cb-public');
	app.alias(router.options.staticUrl + '/', '/cb-public/');
	app.alias(router.options.staticUrl + '/favicon.ico', '/cb-public/favicon-test.ico');
	app.set('view engine', 'swig');
	app.set('case sensitive routing', false);
	app.set('views', __dirname + '/views');
	utils.load(router.options);
	app.load('controllers', __dirname + '/controllers').load('routes', __dirname + '/routes');
	return app;
};



module.exports.hash = function(pass) {
	return utils.sha512(pass);
};