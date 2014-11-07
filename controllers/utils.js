var crypto    = require('crypto');
var fs        = require('fs');
var extend    = require('util')._extend;
var marked    = require('marked');
var swig      = require('swig');
var markCache = {};
var swigCache = {};


marked.setOptions({ highlight: function (code) {
	return require('highlight.js').highlightAuto(code).value;
}});

exports.sha512 = function(text) {
	var sha = crypto.createHmac('sha512', 'r4ya6u7i8eu254t');
    sha.update('' + text);
    return sha.digest('hex');
};


exports.md5 = function(text) {
	var sha = crypto.createHash('md5');
    sha.update('' + text);
    return sha.digest('hex');
};


exports.hex2rgba = function(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
};

exports.wrap = function (options, callback) {
	return function(request, response, next){

		var viewsPath  = options.views || response.getVariable('views');
		swig.setDefaults({ autoescape: response.variables['view autoescape'] });
		swig.setDefaultTZOffset(response.variables['view timezone']);

		var res = extend({cook: response.cook}, response);
		if (request.options) {
			extend (request.options, options);
		} else {
			extend(request, {options: extend({}, options)});
		}

		res.render = function(data, view, cabView, obj) {
			if (view) {
				if (view.indexOf(".html") === -1) { //файл в viewsPath
					view = viewsPath + '/' + view + '.html';
				}
				if (!swigCache[view]) {
					swigCache[view] = swig.compileFile(view);
				}
				data = swigCache[view](data);
			}
			response.render( cabView||'index', extend(extend({data:data}, request.options), obj||{} ) );
		};

		res.json = function(data) {
			response.type('json').send(JSON.stringify(data, "\t", 4));
		};

		res.mark = function(data) {
			var hash = exports.md5(data);
			if (!markCache[hash]) {
				markCache[hash] = marked(data, true);
				setTimeout(function(){
					if (markCache[hash]) {
						delete markCache[hash];
					}
				}, 10000);
			}
			res.render('<div class="markdown">' + markCache[hash] + '</div>');
		};

		res.dump = function(data) {
			res.mark("```\n" + JSON.stringify(data, "\t", 4) + '\n```');
		};



		callback(request, res, next);
	};
};


exports.run = function (req, res, next) {
	if (!req.params.module || typeof req.options.modules[req.params.module] == 'undefined') {
		res.redirect(req.options.home);
		next();
	} else {
		var page = req.options.modules[req.params.module];
		req.options.menu.forEach(function(el, i) {
			el.active = req.options.baseUrl + '/' + page.route.toLowerCase() === el.url.toLowerCase();
		});
		req.options.page = page;
		page.method (req, res, next);
	}
};


exports.load = function(options) {
	var path = options.path;
	var controllers = {};

	fs.readdirSync(path).forEach(function(el, i) {
		// Require only .js files
		if (/.*\.js$/gi.test(el)) {
			var module = require(path + '/' + el);
			if (typeof module.info == 'object') {
				extend(controllers, module.info);
			}
		}
	});
	for (r in controllers) {
		controllers[r] = extend({
			title: '',
			route: r,
			showTitle:  true,
			showInMenu: true,
			parentMenu: "/",
			order: 5,
			count: 0,
			url: (options.baseUrl + '/' + r),
			note: '',
			active: 0
		}, controllers[r]);
		options.menu.push(controllers[r]);
	}
	options.menu.sort(function(a, b) {return  a.order > b.order ? 1 : (a.order < b.order ? -1 : 0);});
	exports.add(options, controllers);
	if (options.loadDefaults) {
		options.loadDefaults = false;
		options.path = __dirname + '/../default-pages';
		exports.load(options);
	}
};


exports.add = function(options, obj) {
	if (typeof obj == 'object') {
		if (options.modules) {
			extend(options.modules, obj);
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