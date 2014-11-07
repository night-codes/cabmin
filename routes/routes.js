module.exports = function(router) {

	var ctrl   = router.controllers;
	var opt    = router.options;
	var utils  = ctrl.utils;

	// Получаем необходимые страницы в "обертке"
	var auth   = utils.wrap (opt, ctrl.auth.test);
	var run    = utils.wrap (opt, utils.run);
	var main   = utils.wrap (opt, ctrl.redirect.main);


	// Подключаем папку модулей (через модуль авторизации)
	router.use(opt.baseUrl + '/:module', auth, run);


	// Редиректим с main на нужный модуль (если нужно)
	router.use(opt.baseUrl, auth, main);

};
