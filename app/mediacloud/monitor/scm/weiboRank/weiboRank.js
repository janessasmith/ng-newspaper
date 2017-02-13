var weiboRankApp = angular.module('weiboRank.router', [
	'ui.router',
	'weiboRankCtrl'
	]);

//配置路由
weiboRankApp.config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider
		.state('weiboRank', {
			url: "/weiboRank",
			templateUrl: "app/monitor/scm/weiboRank/tpls/wbNavigation.html",
			abstract: true
		})
		.state("weiboRank.list", {
			url: '/:unitName/:accountType',
			templateUrl: "app/monitor/scm/weiboRank/tpls/wbContent.html"
		})
});