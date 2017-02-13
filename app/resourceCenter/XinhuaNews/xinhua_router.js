"use strict";
angular.module('resCenterXHRouterModule', []).config(['$stateProvider', function($stateProvider) {
	$stateProvider.state("resourcectrl.xinhua.resource", {
		url: '/resource?metacid&nodeid&nodename&change',
		views: {
			'resource@resourcectrl.xinhua': {
				templateUrl: './resourceCenter/XinhuaNews/xinhua_main_tpl.html',
				controller: 'resCenterXHRelCtrl'
			}
		}
	});
}]);