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


	app.fileServer(__dirname, '/static-cb');
	app.alias(router.options.staticUrl + '/', '/static-cb/');
	app.alias(router.options.staticUrl + '/favicon.ico', '/static-cb/favicon-test.ico');
	app.set('view engine', 'swig');
	app.set('case sensitive routing', false);
	app.set('views', __dirname + '/views');
	utils.load(router.options);
	app.load('controllers', __dirname + '/controllers').load('routes', __dirname + '/routes');
	return app;
};






















/*
module.exports.init({
	title: 'MSRV',
	color: '#330066',
	modules: '/home/mirrr/Проекти/cabmin/cabmin',
	baseUrl: '/cabmin',
	users: {
		mirrr: {
			hash:   "443a971d10aef5025a9f67929d3811f20a9b2c98202747c315aa9d2f8181e3c3893cb15c989d3d57d012c2e45ef13d15481ac31ca38ae289865192aa1daec7aa",
			role:   "admin",
			groups: "admin, root"
		}
	}
})

app.listen(4000);*/