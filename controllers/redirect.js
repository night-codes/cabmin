exports.main = function(req, res, next){
	if (req.options.mainPage && req.options.mainPage != '/') {
		res.redirect(req.options.home);
	} else {
		req.options.menu.forEach(function(el) {
			el.active = false;
		});
		res.render("Main page");
	}
};

