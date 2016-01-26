var crypto    = require('crypto');
var fs        = require('fs');
var extend    = require('util')._extend;
var marked    = require('marked');
var swig      = require('swig');
var markCache = {};
var swigCache = {};
var fakeUser  = {upd: 0};


marked.setOptions({ highlight: function (code) {
	return require('highlight.js').highlightAuto(code).value;
}});

exports.sha512 = function (text, secret, salt) {
	secret = secret || 'r4ya6u7i8eu254t';
	var sha = crypto.createHmac('sha512', secret);
	sha.update(String(text));

	if (salt) {
		sha.update(salt);
	}

	return sha.digest('hex');
};


exports.md5 = function (text, salt) {
	var md5 = crypto.createHash('md5');
	md5.update(String(text));

	if (salt) {
		md5.update(salt);
	}

	return md5.digest('hex');
};


exports.hex2rgba = function (hex, opacity) {
	hex = hex.replace('#', '');
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);

	return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
};

exports.arrayTest = function (arr1, arr2) {
	return arr1.filter(function (i) {
		return (arr2.indexOf(i) > -1);
	});
};

exports.wrap = function (options, callback) {
	return function (request, response, next) {

		var viewsPath  = options.views || response.getVariable('views');
		swig.setDefaults({ autoescape: response.variables['view autoescape'] });
		swig.setDefaultTZOffset(response.variables['view timezone']);

		var res = extend({cook: response.cook}, response);

		if (request.options) {
			extend(request.options, options);
		} else {
			extend(request, {options: extend({}, options)});
		}

		res.render = function (view, data, cabView, obj) {
			if (arguments.length === 1) {
				data = view;
				view = false;
			}

			if ( typeof view === 'object' && typeof data === 'string') {
				var swith = view;
				view = data; data = swith;
			}

			if (view) {
				if (view.indexOf('.html') === -1) { // файл в viewsPath
					view = viewsPath + '/' + view + '.html';
				}

				if (!swigCache[view]) {
					swigCache[view] = swig.compileFile(view);
				}

				var d = extend(extend({}, request.options), typeof data === 'object' ? data : {data: data});
				data = swigCache[view](d);
			}

			response.status(res.statusCode);
			response.render( cabView || 'index', extend(extend({data: data}, request.options), obj || {}));
		};

		res.json = function (data) {
			response.status(res.statusCode);
			response.type('json').send(JSON.stringify(data, '\t', 4));
		};

		res.mark = function (data) {
			var hash = exports.md5(data);

			if (!markCache[hash]) {
				markCache[hash] = marked(data, true);
				setTimeout(function () {
					if (markCache[hash]) {
						delete markCache[hash];
					}
				}, 10000);
			}

			res.render('<div class="markdown">' + markCache[hash] + '</div>');
		};

		res.dump = function (data) {
			res.mark('```\n' + JSON.stringify(data, '\t', 4) + '\n```');
		};

		callback(request, res, next);
	};
};


exports.run = function (req, res, next) {

	var step = true;
	var pg404 = false;

	if (!req.params.module || typeof req.options.modules[req.params.module] === 'undefined') {
		if (!req.options.modules['404']) {
			res.redirect(req.options.home);
			step = false;
			next();
		} else {
			pg404 = true;
		}
	}

	if (step) {
		var page = req.options.modules[req.params.module];

		var user = req.options.user || false;
		var u = user ? req.options.users[user.login] : fakeUser;
		var updated = false;

		if (page && page.tabs) {
			var firstTab;
			var activeTab;

			for (var tabKey in page.tabs) {
				if (!firstTab) {
					firstTab = tabKey;
				}

				if (tabKey === 'default' && !activeTab) {
					activeTab = 'default';
				}

				if (req.query.tab && tabKey === req.query.tab) {
					activeTab = tabKey;
				}
			}

			page.activeTab = activeTab || firstTab;
		}

		if (pg404) {
			req.options.page = page = req.options.modules['404'];
		}

		if (user || req.options.noAuth) {
			var sec = parseInt(Date.now() / 1000, 10);

			if (!u.upd || Number(u.upd) !== sec) {
				u.upd = sec;
				req.options.menu.forEach(function (el, i) {
					var info = req.options.reinfo[req.options.menu[i].route](req.options.noAuth ? false : user);
					exports.add(req.options, info);
				});
			}

			updated = true;
		}


		req.options.menu.forEach(function (el, i) {
			if (updated) extend(req.options.menu[i], req.options.modules[req.options.menu[i].r]);
			el.active = req.options.baseUrl + '/' + page.route.toLowerCase() === el.url.toLowerCase();
		});
		req.options.page = page;
		req.current = page;

		var pg = req.options.page.groups.split(',').map(function (el) {
			return String(el.trim());
		});
		var ug = (user && user.groups) ? user.groups.split(',').map(function (el) {
			return String(el.trim());
		}) : [];
		ug.push('all');

		if (user && user.groups) {
			req.options.menu = req.options.menu.filter(function (el) {
				if (!el.groups) return false;
				var g = el.groups.split(',').map(function (el) {return String(el.trim());});

				if (!exports.arrayTest(ug, g).length) {
					return false;
				}

				return true;
			});
		}

		if (!exports.arrayTest(ug, pg).length) {
			if (req.options.modules['access-denied']) {
				req.options.page = page = req.options.modules['access-denied'];
			} else {
				page.showTitle = false;
				page.method = function access(req, res) {
					res.render(__dirname + '/../views/access-denied.html', {});
				};
			}
		}

		var p = req.path.replace(req.options.page.url + '/', '').split('/');
		extend(req.params, p);
		req.length = p.length;
		page.method(req, res, next);
	}
};


exports.load = function (options) {
	var path = options.path;
	var controllers = {};
	var reinfo = {};

	fs.readdirSync(path).forEach(function (el) {
		// Require only .js files
		if (/.*\.js$/gi.test(el)) {
			var module = require(path + '/' + el);

			if (typeof module === 'function') {
				var info = module();

				if (typeof info === 'object') {
					for (var r in info) {
						reinfo[r] = module;
					}

					extend(controllers, info);
				}
			}
		}
	});

	for (var r in controllers) {
		controllers[r] = extend({
			title: '',
			route: r,
			showTitle:  true,
			showInMenu: true,
			parentMenu: '/',
			order: 5,
			count: 0,
			groups: 'all',
			url: (options.baseUrl + '/' + r),
			note: '',
			active: 0
		}, controllers[r]);
		options.menu.push(controllers[r]);
	}

	options.menu.sort(function (a, b) {return  a.order > b.order ? 1 : (a.order < b.order ? -1 : 0);});
	exports.add(options, controllers);

	if (options.reinfo) {
		extend(options.reinfo, reinfo);
	} else {
		options.reinfo = reinfo;
	}

	if (options.loadDefaults) {
		options.loadDefaults = false;
		options.path = __dirname + '/../default-pages';
		exports.load(options);
	}
};


exports.add = function (options, obj) {
	if (typeof obj === 'object') {
		if (options.modules) {
			for (var el in obj) {
				if (options.modules[el]) {
					extend(options.modules[el], obj[el]);
				} else {
					options.modules[el] = obj[el];
				}
			}
		} else {
			options.modules = obj;
		}
	}
};



exports.MINUTE = 60  * 1000;
exports.HOUR   = 60  * exports.MINUTE;
exports.DAY    = 24  * exports.HOUR;
exports.WEEK   = 7   * exports.DAY;
exports.MONTH  = 30  * exports.DAY;
exports.YEAR   = 365 * exports.DAY;
