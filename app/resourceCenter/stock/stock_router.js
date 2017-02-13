"use strict";
angular.module('resCenterJTRouterModule', []).config(['$stateProvider', function($stateProvider) {
	$stateProvider.state("resourcectrl.stock.resource", {
		url: '/resource?nodeid&nodename&change',
		views: {
			'resource@resourcectrl.stock': {
				templateUrl: './resourceCenter/stock/fdraft_main_tpl.html',
				controller: 'resourceCenterStockCtrl'
			}
		}
	});
}]);