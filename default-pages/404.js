module.exports = function(user) {
	return {
		"404": {
			title: 'Page not found',
			method: access,
			showTitle: true,
			showInMenu: false
		}
	};
};

function access(req, res) {
	res.status(404);
	res.render('Page not found on the server, check the entered URL.');
}