module.exports = function(user) {
	return {
		"logout": {
			title: 'Full ogout',
			method: logout,
			showInMenu: false
		},
		"lock": {
			title: 'Logout',
			method: lock,
			dropmenu: true,
			order: 8,
			topDivider: true
		}
	};
};

function lock(req, res, next) {
	res.clearCookie('hash', {path: req.options.baseUrl});
	res.redirect(req.options.home);
	next();
}


function logout(req, res, next) {
	res.clearCookie('login', {path: req.options.baseUrl});
	res.clearCookie('hash', {path: req.options.baseUrl});
	res.redirect(req.options.home);
	next();
}