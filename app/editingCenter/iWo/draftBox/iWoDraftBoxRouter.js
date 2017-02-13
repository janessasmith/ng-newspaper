'use strict';
angular.module('iWoDraftBoxRouterModule', [])
.config(['$stateProvider',function($stateProvider) {
	$stateProvider.state("editctr.iWo.draftBox",{
		url:"/draftBox",
		views:{
			"main@editctr":{
				templateUrl:"./editingCenter/iWo/draftBox/draftBox_tpl.html",
				controller:"iWoDraftBoxCtrl"
			}
		}
	});
}]);