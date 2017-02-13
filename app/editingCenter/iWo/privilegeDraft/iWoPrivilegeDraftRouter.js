"use strict";
angular.module('iWoPrivilegeDraftRouterModule', [])
.config(['$stateProvider',function($stateProvider) {
	$stateProvider.state("editctr.iWo.privilegeDraft",{
		url:"/privilegeDraft",
		views:{
			"main@editctr":{
				templateUrl:"./editingCenter/iWo/privilegeDraft/privilege_draft_tpl.html",
				controller:"iWoPrivilegeDraftCtrl"
			}
		}
	});
}]);