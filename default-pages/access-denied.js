module.exports = function(user) {
	return {
		"access-denied": {
			title: 'Access to this page is forbidden!',
			method: access,
			showTitle: false,
			showInMenu: false
		}
	};
};

function access(req, res) {
	res.status(404);
	res.render(__dirname + '/../views/access-denied.html', {});
}