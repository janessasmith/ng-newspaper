'use strict';
angular.module("editWebsiteCancelDraftMgrRouterModule", []).
config(['$stateProvider',function($stateProvider) {
	$stateProvider.state("editctr.website.signed.cancelDraftMgr", {
		url:"/canceldraftmgr",
		views:{
			"main@editctr":{
				templateUrl:"./editingCenter/website/signed/cancelDraftMgr/cancelDraftMgr_tpl.html",
				controller:"editWebsitecancelDraftMgrCtrl"
			}
		}
	});
}]);