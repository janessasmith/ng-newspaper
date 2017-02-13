/*create by ma.rongqin 2016.3.6*/
'use strict';
angular.module('editIWoResourceCustomRouterModule', [])
.config(['$stateProvider',function($stateProvider) {
	$stateProvider.state("editctr.iWo.custom",{
		url:"/custom?customid&customtype&mycustomid",
		views:{
			"main@editctr":{
				templateUrl:"./editingCenter/iWo/iWoResource/custom/custom_tpl.html",
				controller:"editIWoResourceCustomCtrl"
			}
		}
	}).state("editctr.iWo.emaildraft",{
		url:"/emaildraft?customid&customtype&mycustomid",
		views:{
			"main@editctr":{
				templateUrl:"./editingCenter/iWo/iWoResource/custom/emailDraft_tpl.html",
				controller:"editingCenterSharedMailCtrl"
			}
		}
	});
}]);